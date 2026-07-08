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
  
  // Create new contact
  static async create(contactData) {
    // Check for duplicate email if email is provided
    if (contactData.email) {
      const existingContact = await ContactQueries.findByEmail(contactData.email);
      if (existingContact) {
        const error = new Error('A contact with this email already exists');
        error.code = 'DUPLICATE_EMAIL';
        error.status = 409;
        throw error;
      }
    }
    
    return await ContactQueries.createContact(contactData);
  }
  
  // Find contact by email
  static async findByEmail(email) {
    return await ContactQueries.findByEmail(email);
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
