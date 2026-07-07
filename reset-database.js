const { query } = require('./src/database/connection');
require('dotenv').config();

async function resetDatabase() {
  console.log('Resetting database...');
  
  try {
    // Drop tables in correct order
    await query('DROP TABLE IF EXISTS migrations CASCADE');
    await query('DROP TABLE IF EXISTS contacts CASCADE');
    console.log('Tables dropped successfully');
    
    // Re-run migrations
    console.log('Re-running migrations...');
    require('./run-migrations.js');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('Database reset completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Database reset failed:', error);
      process.exit(1);
    });
}

module.exports = resetDatabase;
