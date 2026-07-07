const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { validatePagination, validateId } = require('../middleware/validation');

/**
 * @route GET /api/contacts
 * @desc Get all contacts with pagination
 * @access Public
 */
router.get('/', validatePagination, async (req, res) => {
  try {
    const { page, limit } = req.parsedQuery;
    const result = await Contact.findAll({ page, limit });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch contacts'
      }
    });
  }
});

/**
 * @route GET /api/contacts/:id
 * @desc Get single contact by ID
 * @access Public
 */
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Contact not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch contact'
      }
    });
  }
});

module.exports = router;
