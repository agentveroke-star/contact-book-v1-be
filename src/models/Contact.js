const ContactQueries = require('../database/queries/contacts');

class Contact {
  // Get all contacts with pagination
  static async findAll({ page = 1, limit = 10 }) {
    return await ContactQueries.findAll({ page, limit });
  }
  
  // Find contact by ID
  static async findById(id) {
    return await ContactQueries.findById(id);
  }
  
  // Get total count (for compatibility)
  static async count() {
    return await ContactQueries.count();
  }
  
  // Health check (moved to health routes)
  static async healthCheck() {
    return await ContactQueries.healthCheck();
  }
}

module.exports = Contact;
