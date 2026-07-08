-- Migration 003: Add unique constraint on email column
-- Note: PostgreSQL allows multiple NULL values with UNIQUE constraint, which is correct for optional email

-- First, check if there are any duplicate emails (excluding NULLs)
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT email, COUNT(*) as cnt
        FROM contacts 
        WHERE email IS NOT NULL 
        GROUP BY email 
        HAVING COUNT(*) > 1
    ) AS duplicates;
    
    IF duplicate_count > 0 THEN
        RAISE EXCEPTION 'Found % duplicate emails. Please clean data before adding unique constraint.', duplicate_count;
    END IF;
END $$;

-- Add unique constraint on email column
ALTER TABLE contacts ADD CONSTRAINT unique_email UNIQUE (email);

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT unique_email ON contacts IS 'Ensures email uniqueness while allowing multiple NULL values (optional field)';
