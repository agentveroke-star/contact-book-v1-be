const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

/**
 * @route GET /api/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/', (req, res) => {
  try {
    // Basic health check - server is running
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'contact-book-api',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      // Add contact count for additional health indicator
      contacts: Contact.count()
    };
    
    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'contact-book-api',
      error: error.message
    });
  }
});

module.exports = router;
