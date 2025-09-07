const db = require('./db');

console.log('Testing database connection...');

db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="users"', (err, row) => {
  if (err) {
    console.error('Database test failed:', err);
    process.exit(1);
  } else if (row) {
    console.log('✅ Database connection successful! Users table exists.');
    process.exit(0);
  } else {
    console.log('⚠️ Database connected but users table not found. This is normal for first run.');
    process.exit(0);
  }
});
