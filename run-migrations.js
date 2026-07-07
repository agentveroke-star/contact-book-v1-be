const fs = require('fs');
const path = require('path');
const { query } = require('./src/database/connection');
require('dotenv').config();

async function runMigrations() {
  console.log('Starting database migrations...');
  
  // Check if migrations table exists
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('Migrations table ready');
  } catch (error) {
    console.error('Error creating migrations table:', error);
    process.exit(1);
  }
  
  // Get all migration files
  const migrationsDir = path.join(__dirname, 'src/database/migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  console.log(`Found ${migrationFiles.length} migration files`);
  
  for (const fileName of migrationFiles) {
    // Check if migration has already been run
    const result = await query('SELECT id FROM migrations WHERE name = $1', [fileName]);
    
    if (result.rows.length === 0) {
      console.log(`Running migration: ${fileName}`);
      
      try {
        // Read and execute the migration SQL
        const filePath = path.join(migrationsDir, fileName);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        await query(sql);
        
        // Record the migration
        await query('INSERT INTO migrations (name) VALUES ($1)', [fileName]);
        console.log(`✓ Migration ${fileName} completed successfully`);
      } catch (error) {
        console.error(`✗ Error running migration ${fileName}:`, error);
        process.exit(1);
      }
    } else {
      console.log(`Migration ${fileName} already executed, skipping`);
    }
  }
  
  console.log('All migrations completed successfully');
  
  // Verify the contacts table exists
  try {
    const result = await query(`
      SELECT COUNT(*) as count FROM contacts
    `);
    console.log(`Contacts table verified with ${result.rows[0].count} records`);
  } catch (error) {
    console.error('Error verifying contacts table:', error);
    process.exit(1);
  }
}

runMigrations()
  .then(() => {
    console.log('Migration process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });
