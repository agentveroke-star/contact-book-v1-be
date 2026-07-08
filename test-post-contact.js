// Test script for POST /api/contacts endpoint
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testPostContact() {
  console.log('=== Testing POST /api/contacts endpoint ===\n');
  
  let allTestsPassed = true;
  
  try {
    // Test 1: Create valid contact
    console.log('Test 1: Create valid contact');
    const validContact = {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1-555-123-4567',
      organization: 'Tech Corp'
    };
    
    const response1 = await axios.post(`${BASE_URL}/contacts`, validContact);
    
    if (response1.status === 201 && response1.data.success === true) {
      console.log('  ✓ Success: Contact created with ID:', response1.data.data.id);
      console.log('  ✓ Response contains all expected fields');
      
      // Verify response structure
      const contact = response1.data.data;
      const requiredFields = ['id', 'firstName', 'lastName', 'email', 'phone', 'organization', 'createdAt', 'updatedAt'];
      const missingFields = requiredFields.filter(field => !(field in contact));
      
      if (missingFields.length === 0) {
        console.log('  ✓ All required fields present');
      } else {
        console.log('  ✗ Missing fields:', missingFields);
        allTestsPassed = false;
      }
    } else {
      console.log('  ✗ Failed: Unexpected response');
      console.log('    Status:', response1.status);
      console.log('    Data:', JSON.stringify(response1.data, null, 2));
      allTestsPassed = false;
    }
    
    // Test 2: Validation error - missing required fields
    console.log('\nTest 2: Validation error - missing required fields');
    try {
      await axios.post(`${BASE_URL}/contacts`, {
        firstName: '',
        lastName: ''
      });
      console.log('  ✗ Expected validation error but request succeeded');
      allTestsPassed = false;
    } catch (error) {
      if (error.response?.status === 400 && 
          error.response?.data?.error?.code === 'VALIDATION_ERROR') {
        console.log('  ✓ Success: Validation error returned');
        console.log('  ✓ Error code:', error.response.data.error.code);
        console.log('  ✓ Error details:', error.response.data.error.details.length, 'validation errors');
      } else {
        console.log('  ✗ Unexpected error:', error.response?.status, error.response?.data);
        allTestsPassed = false;
      }
    }
    
    // Test 3: Validation error - invalid email format
    console.log('\nTest 3: Validation error - invalid email format');
    try {
      await axios.post(`${BASE_URL}/contacts`, {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'invalid-email-format'
      });
      console.log('  ✗ Expected validation error but request succeeded');
      allTestsPassed = false;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('  ✓ Success: Invalid email validation error');
      } else {
        console.log('  ✗ Unexpected error:', error.response?.status);
        allTestsPassed = false;
      }
    }
    
    // Test 4: Validation error - invalid phone format
    console.log('\nTest 4: Validation error - invalid phone format');
    try {
      await axios.post(`${BASE_URL}/contacts`, {
        firstName: 'Bob',
        lastName: 'Smith',
        phone: 'abc123!@#'
      });
      console.log('  ✗ Expected validation error but request succeeded');
      allTestsPassed = false;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('  ✓ Success: Invalid phone validation error');
      } else {
        console.log('  ✗ Unexpected error:', error.response?.status);
        allTestsPassed = false;
      }
    }
    
    // Test 5: Duplicate email error (409 Conflict)
    console.log('\nTest 5: Duplicate email error (409 Conflict)');
    try {
      // Try to create another contact with same email
      await axios.post(`${BASE_URL}/contacts`, {
        firstName: 'Duplicate',
        lastName: 'Test',
        email: 'alice.johnson@example.com', // Same email as Test 1
        phone: '+1-555-999-8888'
      });
      console.log('  ✗ Expected duplicate email error but request succeeded');
      allTestsPassed = false;
    } catch (error) {
      if (error.response?.status === 409 && 
          error.response?.data?.error?.code === 'DUPLICATE_EMAIL') {
        console.log('  ✓ Success: Duplicate email error (409 Conflict)');
        console.log('  ✓ Error code:', error.response.data.error.code);
      } else {
        console.log('  ✗ Unexpected error:', error.response?.status, error.response?.data?.error?.code);
        allTestsPassed = false;
      }
    }
    
    // Test 6: Create contact with only required fields (email optional)
    console.log('\nTest 6: Create contact with only required fields');
    try {
      const response6 = await axios.post(`${BASE_URL}/contacts`, {
        firstName: 'Charlie',
        lastName: 'Brown'
        // No email, phone, or organization
      });
      
      if (response6.status === 201) {
        console.log('  ✓ Success: Contact created with only required fields');
        console.log('  ✓ Email is null:', response6.data.data.email === null);
        console.log('  ✓ Phone is null:', response6.data.data.phone === null);
        console.log('  ✓ Organization is null:', response6.data.data.organization === null);
      } else {
        console.log('  ✗ Unexpected response:', response6.status);
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('  ✗ Failed:', error.message);
      allTestsPassed = false;
    }
    
    // Test 7: Verify backward compatibility - existing GET endpoints still work
    console.log('\nTest 7: Backward compatibility - existing GET endpoints');
    try {
      const getResponse = await axios.get(`${BASE_URL}/contacts?page=1&limit=10`);
      if (getResponse.status === 200 && getResponse.data.success === true) {
        console.log('  ✓ GET /contacts endpoint works');
        console.log('  ✓ Retrieved', getResponse.data.data.contacts.length, 'contacts');
      } else {
        console.log('  ✗ GET /contacts endpoint failed');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('  ✗ GET /contacts endpoint error:', error.message);
      allTestsPassed = false;
    }
    
    console.log('\n=== Test Summary ===');
    if (allTestsPassed) {
      console.log('✓ All tests passed!');
      console.log('\nPOST /api/contacts endpoint is working correctly.');
      console.log('Features verified:');
      console.log('  - Contact creation with valid data');
      console.log('  - Validation for required fields');
      console.log('  - Email format validation');
      console.log('  - Phone format validation');
      console.log('  - Duplicate email detection (409 Conflict)');
      console.log('  - Optional fields handling');
      console.log('  - Backward compatibility with existing GET endpoints');
    } else {
      console.log('✗ Some tests failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Test suite error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run tests
testPostContact();
