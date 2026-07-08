const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { validatePagination, validateId, validateContactCreate } = require('../middleware/validation');

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

/**
 * @route POST /api/contacts
 * @desc Create new contact
 * @access Public
 */
router.post('/', validateContactCreate, async (req, res) => {
  try {
    const contactData = req.validatedContact;
    const newContact = await Contact.create(contactData);
    
    res.status(201).json({
      success: true,
      data: newContact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    
    // Handle duplicate email error
    if (error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_EMAIL',
          message: error.message
        }
      });
    }
    
    // Handle database unique constraint violation (as a fallback)
    if (error.code === '23505' && error.constraint === 'unique_email') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_EMAIL',
          message: 'A contact with this email already exists'
        }
      });
    }
    
    // Handle other database errors
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create contact'
      }
    });
  }
});

module.exports = router;
