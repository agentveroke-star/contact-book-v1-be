const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { validateContact, validatePagination, validateId } = require('../middleware/validation');

/**
 * @route GET /api/contacts
 * @desc Get all contacts with pagination
 * @access Public
 */
router.get('/', validatePagination, (req, res) => {
  try {
    const { page, limit } = req.parsedQuery;
    const result = Contact.findAll({ page, limit });
    
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
router.get('/:id', validateId, (req, res) => {
  try {
    const { id } = req.params;
    const contact = Contact.findById(id);
    
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
 * @desc Create a new contact
 * @access Public
 */
router.post('/', validateContact, (req, res) => {
  try {
    const contactData = req.body;
    const newContact = Contact.create(contactData);
    
    res.status(201).json({
      success: true,
      data: newContact,
      message: 'Contact created successfully'
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create contact'
      }
    });
  }
});

/**
 * @route PUT /api/contacts/:id
 * @desc Update an existing contact
 * @access Public
 */
router.put('/:id', validateId, validateContact, (req, res) => {
  try {
    const { id } = req.params;
    const contactData = req.body;
    
    const updatedContact = Contact.update(id, contactData);
    
    if (!updatedContact) {
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
      data: updatedContact,
      message: 'Contact updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update contact'
      }
    });
  }
});

/**
 * @route DELETE /api/contacts/:id
 * @desc Delete a contact
 * @access Public
 */
router.delete('/:id', validateId, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = Contact.delete(id);
    
    if (!deleted) {
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
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete contact'
      }
    });
  }
});

module.exports = router;
