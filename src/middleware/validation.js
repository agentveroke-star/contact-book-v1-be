/**
 * Validation middleware for contact data
 */

// Regular expressions for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-().]*$/; // Allows empty string or valid phone characters

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

// Validate UUID parameter
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  // UUID v4 pattern (for existing contacts)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  // Also accept "health" for health check endpoint
  if (id === 'health') {
    return next();
  }
  
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

// Validate contact creation data
const validateContactCreate = (req, res, next) => {
  const { firstName, lastName, email, phone, organization } = req.body;
  const errors = [];
  
  // Validate firstName (required)
  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  } else if (firstName.trim().length > 100) {
    errors.push({ field: 'firstName', message: 'First name must be 100 characters or less' });
  }
  
  // Validate lastName (required)
  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  } else if (lastName.trim().length > 100) {
    errors.push({ field: 'lastName', message: 'Last name must be 100 characters or less' });
  }
  
  // Validate email (optional)
  if (email !== undefined && email !== null && email !== '') {
    if (typeof email !== 'string') {
      errors.push({ field: 'email', message: 'Email must be a string' });
    } else if (email.trim().length > 255) {
      errors.push({ field: 'email', message: 'Email must be 255 characters or less' });
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }
  }
  
  // Validate phone (optional)
  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string') {
      errors.push({ field: 'phone', message: 'Phone must be a string' });
    } else if (phone.trim().length > 50) {
      errors.push({ field: 'phone', message: 'Phone must be 50 characters or less' });
    } else if (!PHONE_REGEX.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Phone can only contain digits, spaces, +, -, (, ), .' });
    }
  }
  
  // Validate organization (optional)
  if (organization !== undefined && organization !== null && organization !== '') {
    if (typeof organization !== 'string') {
      errors.push({ field: 'organization', message: 'Organization must be a string' });
    } else if (organization.trim().length > 255) {
      errors.push({ field: 'organization', message: 'Organization must be 255 characters or less' });
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors
      }
    });
  }
  
  // Trim all string fields and add to request object
  req.validatedContact = {
    firstName: firstName ? firstName.trim() : '',
    lastName: lastName ? lastName.trim() : '',
    email: email ? email.trim() : null,
    phone: phone ? phone.trim() : null,
    organization: organization ? organization.trim() : null
  };
  
  next();
};

module.exports = {
  validatePagination,
  validateId,
  validateContactCreate
};
