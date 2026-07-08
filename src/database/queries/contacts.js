const { query } = require('../connection');

class ContactQueries {
  // Get all contacts with pagination
  static async findAll({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await query('SELECT COUNT(*) as total FROM contacts');
    const total = parseInt(countResult.rows[0].total);
    
    // Get paginated contacts
    const result = await query(
      `SELECT 
         id,
         first_name as "firstName",
         last_name as "lastName",
         email,
         phone,
         organization,
         created_at as "createdAt",
         updated_at as "updatedAt"
       FROM contacts
       ORDER BY last_name, first_name
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      contacts: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
  
  // Find contact by ID
  static async findById(id) {
    const result = await query(
      `SELECT 
         id,
         first_name as "firstName",
         last_name as "lastName",
         email,
         phone,
         organization,
         created_at as "createdAt",
         updated_at as "updatedAt"
       FROM contacts
       WHERE id = $1`,
      [id]
    );
    
    return result.rows[0] || null;
  }
  
  // Create new contact
  static async createContact(contactData) {
    const { firstName, lastName, email, phone, organization } = contactData;
    
    const result = await query(
      `INSERT INTO contacts 
       (first_name, last_name, email, phone, organization) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING 
         id,
         first_name as "firstName",
         last_name as "lastName",
         email,
         phone,
         organization,
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [firstName, lastName, email, phone, organization]
    );
    
    return result.rows[0];
  }
  
  // Find contact by email (for duplicate detection)
  static async findByEmail(email) {
    if (!email) return null;
    
    const result = await query(
      `SELECT 
         id,
         first_name as "firstName",
         last_name as "lastName",
         email,
         phone,
         organization,
         created_at as "createdAt",
         updated_at as "updatedAt"
       FROM contacts
       WHERE email = $1`,
      [email]
    );
    
    return result.rows[0] || null;
  }
  
  // Count all contacts
  static async count() {
    const result = await query('SELECT COUNT(*) as count FROM contacts');
    return parseInt(result.rows[0].count);
  }
  
  // Health check
  static async healthCheck() {
    try {
      await query('SELECT 1');
      return { healthy: true };
    } catch (error) {
      return { healthy: false, message: error.message };
    }
  }
}

module.exports = ContactQueries;
