/**
 * Validation middleware for contact data
 * NOTE: View-only operations only - no create/update/delete validation needed
 */

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

module.exports = {
  validatePagination,
  validateId
};
