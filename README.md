# Contact Book v1 Backend API

RESTful API for Contact Book v1 application with in-memory storage.

## Features

- **Contact Management**: CRUD operations for contacts
- **Pagination**: Support for 10, 25, or 50 items per page
- **Validation**: Comprehensive input validation
- **Error Handling**: Structured error responses
- **Health Check**: Monitoring endpoint
- **CORS Support**: Cross-origin resource sharing enabled

## API Endpoints

### Health Check
- `GET /api/health` - Check API health status

### Contacts
- `GET /api/contacts` - List all contacts with pagination
- `GET /api/contacts/:id` - Get single contact by ID
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update existing contact
- `DELETE /api/contacts/:id` - Delete contact

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create environment file:
   ```bash
   cp .env.example .env
   ```
5. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## API Documentation

### GET /api/contacts
List all contacts with pagination.

**Query Parameters:**
- `page` (optional): Page number, defaults to 1
- `limit` (optional): Items per page (10, 25, or 50), defaults to 10

**Example Request:**
```bash
curl "http://localhost:3001/api/contacts?page=1&limit=10"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "uuid-string",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-123-4567",
        "organization": "Acme Corporation",
        "createdAt": "2026-07-07T12:00:00Z",
        "updatedAt": "2026-07-07T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /api/contacts/:id
Get single contact by ID.

**Path Parameters:**
- `id`: Contact ID (UUID v4 format)

**Example Request:**
```bash
curl "http://localhost:3001/api/contacts/550e8400-e29b-41d4-a716-446655440000"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "organization": "Acme Corporation",
    "createdAt": "2026-07-07T12:00:00Z",
    "updatedAt": "2026-07-07T12:00:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Contact not found"
  }
}
```

### POST /api/contacts
Create a new contact.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "organization": "Acme Corporation"
}
```

**Required Fields:** `firstName`, `lastName`

**Example Request:**
```bash
curl -X POST "http://localhost:3001/api/contacts" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "organization": "Acme Corporation"
  }'
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "organization": "Acme Corporation",
    "createdAt": "2026-07-07T12:00:00Z",
    "updatedAt": "2026-07-07T12:00:00Z"
  },
  "message": "Contact created successfully"
}
```

### PUT /api/contacts/:id
Update an existing contact.

**Path Parameters:**
- `id`: Contact ID (UUID v4 format)

**Request Body:** (All fields optional)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "organization": "Acme Corporation"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3001/api/contacts/uuid-string" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Johnathan",
    "organization": "Updated Corp"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "firstName": "Johnathan",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "organization": "Updated Corp",
    "createdAt": "2026-07-07T12:00:00Z",
    "updatedAt": "2026-07-07T12:05:00Z"
  },
  "message": "Contact updated successfully"
}
```

### DELETE /api/contacts/:id
Delete a contact.

**Path Parameters:**
- `id`: Contact ID (UUID v4 format)

**Example Request:**
```bash
curl -X DELETE "http://localhost:3001/api/contacts/uuid-string"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

### GET /api/health
Health check endpoint.

**Example Request:**
```bash
curl "http://localhost:3001/api/health"
```

**Success Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-07-07T12:00:00Z",
  "service": "contact-book-api",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 123.45,
  "memory": {
    "rss": 12345678,
    "heapTotal": 8765432,
    "heapUsed": 5432109,
    "external": 1234567
  },
  "contacts": 10
}
```

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": [
      // Optional array of validation errors
      { "field": "fieldName", "message": "Error message for this field" }
    ]
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `INVALID_ID`: Invalid UUID format
- `INTERNAL_ERROR`: Server error

## Testing

Run the test script to verify all endpoints:

```bash
node test-api.js
```

This will test all CRUD operations and validation.

## Project Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Contact.js          # Contact model with in-memory storage
│   ├── routes/
│   │   ├── contacts.js         # Contact routes
│   │   └── health.js           # Health check route
│   └── middleware/
│       └── validation.js       # Validation middleware
├── server.js                   # Express server setup
├── package.json                # Dependencies and scripts
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore file
├── test-api.js                 # API test script
└── README.md                   # This file
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## Notes

- **In-memory Storage**: This MVP uses in-memory storage. Data will be lost when the server restarts.
- **Sample Data**: The API initializes with 10 sample contacts on startup.
- **CORS**: Configured to allow requests from `http://localhost:3000` by default.
- **Validation**: All inputs are validated with meaningful error messages.

## Future Enhancements

- Add database persistence (PostgreSQL)
- Implement authentication
- Add search and filtering
- Add unit and integration tests
- Add API documentation (Swagger/OpenAPI)
- Implement rate limiting
