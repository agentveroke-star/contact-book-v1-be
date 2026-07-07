const { v4: uuidv4 } = require('uuid');

// In-memory storage for contacts
let contacts = [];
let nextId = 1;

// Generate sample data for demo
const generateSampleData = () => {
  const sampleContacts = [
    {
      id: uuidv4(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567',
      organization: 'Acme Corporation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-987-6543',
      organization: 'Tech Solutions Inc',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@example.com',
      phone: '+44-20-7946-0958',
      organization: 'Global Innovations',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@example.com',
      phone: '+34-91-123-4567',
      organization: 'Iberia Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@example.com',
      phone: '+86-10-5987-6543',
      organization: 'Shanghai Digital',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.w@example.com',
      phone: '+1-555-456-7890',
      organization: 'North Star Enterprises',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.b@example.com',
      phone: '+1-555-789-0123',
      organization: 'Quantum Solutions',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'Lisa',
      lastName: 'Taylor',
      email: 'lisa.taylor@example.com',
      phone: '+61-2-9876-5432',
      organization: 'Sydney Tech Hub',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@example.com',
      phone: '+1-555-234-5678',
      organization: 'Future Dynamics',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      phone: '+1-555-876-5432',
      organization: 'Creative Minds LLC',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Reset contacts to sample data
  contacts = sampleContacts;
  console.log(`Generated ${contacts.length} sample contacts`);
};

// Initialize with sample data
generateSampleData();

class Contact {
  // Get all contacts with pagination
  static findAll({ page = 1, limit = 10 }) {
    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Validate pagination
    if (pageNum < 1 || limitNum < 1) {
      throw new Error('Page and limit must be positive numbers');
    }
    
    // Calculate pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    // Get paginated contacts
    const paginatedContacts = contacts.slice(startIndex, endIndex);
    
    // Sort by last name, then first name
    const sortedContacts = [...paginatedContacts].sort((a, b) => {
      const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
      const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    return {
      contacts: sortedContacts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: contacts.length,
        totalPages: Math.ceil(contacts.length / limitNum),
        hasNext: endIndex < contacts.length,
        hasPrev: pageNum > 1
      }
    };
  }
  
  // Find contact by ID
  static findById(id) {
    return contacts.find(contact => contact.id === id);
  }
  
  // Create new contact
  static create(contactData) {
    const now = new Date().toISOString();
    const newContact = {
      id: uuidv4(),
      ...contactData,
      createdAt: now,
      updatedAt: now
    };
    
    contacts.push(newContact);
    return newContact;
  }
  
  // Update existing contact
  static update(id, contactData) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) return null;
    
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      updatedAt: new Date().toISOString()
    };
    
    contacts[index] = updatedContact;
    return updatedContact;
  }
  
  // Delete contact
  static delete(id) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) return false;
    
    contacts.splice(index, 1);
    return true;
  }
  
  // Get total count
  static count() {
    return contacts.length;
  }
  
  // Reset to sample data (for testing/demo)
  static reset() {
    generateSampleData();
    return contacts.length;
  }
  
  // Clear all contacts
  static clear() {
    contacts = [];
    return true;
  }
}

module.exports = Contact;
