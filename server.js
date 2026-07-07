const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const contactRoutes = require('./src/routes/contacts');
const healthRoutes = require('./src/routes/health');

// Import database connection to test on startup
const { healthCheck: dbHealthCheck } = require('./src/database/connection');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200
}));
app.use(morgan('combined')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/health', healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
});

// Function to check database connection before starting server
async function checkDatabaseConnection() {
  console.log('Checking database connection...');
  const health = await dbHealthCheck();
  if (health.healthy) {
    console.log('Database connection successful');
    return true;
  } else {
    console.error('Database connection failed:', health.message);
    return false;
  }
}

// Start server
async function startServer() {
  const PORT = process.env.PORT || 3001;
  
  try {
    // Check database connection
    const dbConnected = await checkDatabaseConnection();
    
    if (!dbConnected && process.env.NODE_ENV !== 'test') {
      console.warn('Starting server with database connection issues...');
    }
    
    app.listen(PORT, () => {
      console.log(`Contact Book API server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
      console.log(`Database: ${dbConnected ? 'Connected' : 'Connection issues'}`);
    });
    
    return app;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;
