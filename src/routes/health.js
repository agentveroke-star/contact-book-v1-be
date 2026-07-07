const express = require('express');
const router = express.Router();
const { healthCheck: dbHealthCheck } = require('../database/connection');
const Contact = require('../models/Contact');

/**
 * @route GET /api/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    // Check database health
    const dbHealth = await dbHealthCheck();
    
    // Get contact count for additional health indicator
    const contactCount = await Contact.count();
    
    // Basic health check - server is running
    const healthStatus = {
      status: dbHealth.healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'contact-book-api',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        connected: dbHealth.healthy,
        message: dbHealth.message,
        contactCount: contactCount
      }
    };
    
    res.status(dbHealth.healthy ? 200 : 503).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'contact-book-api',
      error: error.message,
      database: {
        connected: false,
        message: error.message
      }
    });
  }
});

module.exports = router;
