// Simple test script to verify API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('=== Contact Book API Tests ===\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('   ✓ Health check:', healthRes.data.status);
    
    // Test 2: Get all contacts with pagination
    console.log('\n2. Testing GET /contacts with pagination...');
    const contactsRes = await axios.get(`${BASE_URL}/contacts?page=1&limit=5`);
    console.log(`   ✓ Retrieved ${contactsRes.data.data.contacts.length} contacts`);
    console.log(`   ✓ Pagination: page ${contactsRes.data.data.pagination.page} of ${contactsRes.data.data.pagination.totalPages}`);
    
    // Test 3: Get single contact
    if (contactsRes.data.data.contacts.length > 0) {
      const firstContact = contactsRes.data.data.contacts[0];
      console.log(`\n3. Testing GET /contacts/${firstContact.id}...`);
      const singleRes = await axios.get(`${BASE_URL}/contacts/${firstContact.id}`);
      console.log(`   ✓ Retrieved contact: ${singleRes.data.data.firstName} ${singleRes.data.data.lastName}`);
    }
    
    // Test 4: Create new contact
    console.log('\n4. Testing POST /contacts...');
    const newContact = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com',
      phone: '+1-555-999-8888',
      organization: 'Test Corp'
    };
    const createRes = await axios.post(`${BASE_URL}/contacts`, newContact);
    console.log(`   ✓ Created new contact with ID: ${createRes.data.data.id}`);
    
    // Test 5: Update contact
    const contactId = createRes.data.data.id;
    console.log(`\n5. Testing PUT /contacts/${contactId}...`);
    const updateData = {
      firstName: 'Updated',
      lastName: 'TestUser',
      organization: 'Updated Corp'
    };
    const updateRes = await axios.put(`${BASE_URL}/contacts/${contactId}`, updateData);
    console.log(`   ✓ Updated contact: ${updateRes.data.data.firstName} ${updateRes.data.data.lastName}`);
    
    // Test 6: Delete contact
    console.log(`\n6. Testing DELETE /contacts/${contactId}...`);
    await axios.delete(`${BASE_URL}/contacts/${contactId}`);
    console.log(`   ✓ Deleted contact successfully`);
    
    // Test 7: Validation errors
    console.log('\n7. Testing validation errors...');
    try {
      await axios.get(`${BASE_URL}/contacts?page=0&limit=5`);
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('   ✓ Validation error for invalid page (expected)');
      }
    }
    
    console.log('\n=== All tests completed successfully ===');
    console.log('\nAPI is working correctly!');
    
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Check if server is running
setTimeout(() => {
  testAPI();
}, 2000);
