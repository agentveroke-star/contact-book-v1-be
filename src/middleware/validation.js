/**
 * Validation middleware for contact data
 */

// Validate contact creation/update data
const validateContact = (req, res, next) => {
  const { firstName, lastName, email, phone, organization } = req.body;
  const errors = [];
  
  // Validate required fields for POST
  if (req.method === 'POST') {
    if (!firstName || firstName.trim() === '') {
      errors.push({ field: 'firstName', message: 'First name is required' });
    }
    if (!lastName || lastName.trim() === '') {
      errors.push({ field: 'lastName', message: 'Last name is required' });
    }
  }
  
  // Validate field lengths and formats
  if (firstName && firstName.length > 100) {
    errors.push({ field: 'firstName', message: 'First name must be 100 characters or less' });
  }
  
  if (lastName && lastName.length > 100) {
    errors.push({ field: 'lastName', message: 'Last name must be 100 characters or less' });
  }
  
  if (email && email.length > 255) {
    errors.push({ field: 'email', message: 'Email must be 255 characters or less' });
  }
  
  if (email && !isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Email format is invalid' });
  }
  
  if (phone && phone.length > 50) {
    errors.push({ field: 'phone', message: 'Phone must be 50 characters or less' });
  }
  
  if (organization && organization.length > 255) {
    errors.push({ field: 'organization', message: 'Organization must be 255 characters or less' });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid contact data',
        details: errors
      }
    });
  }
  
  // Trim whitespace from string fields
  if (firstName) req.body.firstName = firstName.trim();
  if (lastName) req.body.lastName = lastName.trim();
  if (email) req.body.email = email.trim();
  if (phone) req.body.phone = phone.trim();
  if (organization) req.body.organization = organization.trim();
  
  next();
};

// Validate pagination parameters
const validatePagination = (req, res, next) => {
  const { page = '1', limit = '10' } = req.query;
  const errors = [];
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  // Validate page
  if (isNaN(pageNum) || pageNum < 1) {
    errors.push({ field: 'page', message: 'Page must be a positive integer' });
  }
  
  // Validate limit (only allow 10, 25, or 50 as per PRD)
  if (isNaN(limitNum) || ![10, 25, 50].includes(limitNum)) {
    errors.push({ field: 'limit', message: 'Limit must be one of: 10, 25, 50' });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: errors
      }
    });
  }
  
  // Add parsed values to request object
  req.parsedQuery = {
    page: pageNum,
    limit: limitNum
  };
  
  next();
};

// Simple email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate UUID parameter
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  // UUID v4 pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidPattern.test(id)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'Invalid contact ID format'
      }
    });
  }
  
  next();
};

module.exports = {
  validateContact,
  validatePagination,
  validateId,
  isValidEmail
};
