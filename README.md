# Contact Book v1 - Backend API

View-only REST API for Contact Book application with PostgreSQL database.

## Critical Defects Fixed

### BE-DB-001: Database Implementation Mismatch
- **Issue:** PRD requires PostgreSQL with migrations, but implementation used in-memory storage
- **Fix:** 
  - Implemented PostgreSQL database with auto-provisioning
  - Created database schema matching PRD specification
  - Added migration system with seed data
  - Implemented database connection pooling

### BE-SCOPE-001: Scope Mismatch
- **Issue:** PRD specifies "view-only contact list" for v1, but implementation included full CRUD
- **Fix:**
  - Removed POST /api/contacts endpoint (create)
  - Removed PUT /api/contacts/:id endpoint (update)  
  - Removed DELETE /api/contacts/:id endpoint (delete)
  - Kept only GET endpoints as specified in PRD
  - Updated validation middleware for view-only operations

## API Endpoints

### GET /api/contacts
List all contacts with pagination.
- **Query Parameters:**
  - `page` (default: 1) - Page number (1-indexed)
  - `limit` (default: 10) - Items per page (10, 25, or 50)
- **Response:** Paginated contacts sorted by last name, then first name

### GET /api/contacts/:id
Get single contact by ID.
- **Path Parameter:** Contact UUID
- **Response:** Single contact object

### GET /api/health
Health check endpoint.
- **Response:** Service status including database connectivity

## Database Schema

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  organization VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_contacts_name` ON contacts (last_name, first_name)
- `idx_contacts_email` ON contacts (email)
- `idx_contacts_organization` ON contacts (organization)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run database migrations:**
   ```bash
   npm run migrate
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   Server runs on port 3001 by default.

## Development

- **Dev mode:** `npm run dev` (uses nodemon for auto-restart)
- **Reset database:** `npm run reset` (drops and recreates tables)
- **Test:** `npm test` (when tests are implemented)

## Environment Variables

Create `.env` file with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/contact_book_v1
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Verification

1. Database connectivity: `curl http://localhost:3001/api/health`
2. Contact list: `curl "http://localhost:3001/api/contacts?page=1&limit=10"`
3. Single contact: `curl http://localhost:3001/api/contacts/{id}`
4. Non-GET endpoints should return 404 (POST, PUT, DELETE)

## Notes

- This is a view-only API as per PRD requirements
- All data persists in PostgreSQL database
- Seed data includes 15 sample contacts
- CORS configured for `http://localhost:3000`
