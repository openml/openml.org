#!/usr/bin/env node
/**
 * Local Database Initialization Script
 *
 * Creates database tables matching the production Flask schema for backward compatibility.
 * Run this after starting docker-compose.local.yml services.
 *
 * Usage: node scripts/init-local-db.js
 */

const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'openml',
  password: process.env.DB_PASSWORD || 'openml_local_pass',
  database: process.env.DB_NAME || 'openml_local',
};

async function initDatabase() {
  let connection;

  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected to MySQL\n');

    // Create users table (LEGACY SCHEMA - matches production Flask)
    console.log('📋 Creating users table (legacy schema)...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        active TINYINT(1) DEFAULT 0,
        activation_code VARCHAR(40),
        activation_selector VARCHAR(40),
        created_on INT,
        last_login INT,
        ip_address VARCHAR(45),
        company VARCHAR(100),
        phone VARCHAR(20),
        country VARCHAR(100),
        image VARCHAR(255),
        bio TEXT,
        core VARCHAR(10),
        external_source VARCHAR(100),
        external_id VARCHAR(255),
        forgotten_password_code VARCHAR(40),
        forgotten_password_selector VARCHAR(40),
        forgotten_password_time VARCHAR(40),
        remember_code VARCHAR(40),
        remember_selector VARCHAR(40),
        session_hash VARCHAR(255),
        INDEX idx_email (email),
        INDEX idx_username (username),
        INDEX idx_activation_code (activation_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Created users table');

    // Create groups table (LEGACY SCHEMA) - note: groups is a reserved keyword, use backticks
    console.log('📋 Creating groups table (legacy schema)...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`groups\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Created groups table');

    // Create users_groups table (LEGACY SCHEMA)
    console.log('📋 Creating users_groups table (legacy schema)...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        group_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_group (user_id, group_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Created users_groups table');

    // Insert default groups
    console.log('📋 Inserting default groups...');
    await connection.execute(`
      INSERT IGNORE INTO \`groups\` (id, name, description) VALUES
      (1, 'admin', 'Administrator'),
      (2, 'user', 'Regular User')
    `);
    console.log('✅ Inserted default groups');

    // Create email confirmation tokens table (NEW - for email confirmation feature)
    console.log('📋 Creating email_confirmation_token table (new)...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS email_confirmation_token (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_user_id (user_id),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Created email_confirmation_token table');

    // Create password reset tokens table (NEW - for password reset feature)
    console.log('📋 Creating password_reset_token table (new)...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS password_reset_token (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        used BOOLEAN DEFAULT FALSE,
        used_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_user_id (user_id),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Created password_reset_token table');

    // Verify tables were created
    console.log('\n📊 Verifying database schema...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('✅ Tables in database:', tables.map(t => Object.values(t)[0]).join(', '));

    console.log('\n✅ Database initialization complete!');
    console.log('\n📝 Schema matches production Flask for backward compatibility');
    console.log('   - users (legacy table with all Flask fields)');
    console.log('   - groups, users_groups (legacy tables)');
    console.log('   - email_confirmation_token (new for email confirmation)');
    console.log('   - password_reset_token (new for password reset)');
    console.log('\n🔧 To create a test user, run: node scripts/create-test-user.js');

  } catch (error) {
    console.error('\n❌ Error initializing database:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   - Make sure docker-compose.local.yml services are running');
    console.error('   - Run: docker-compose -f docker-compose.local.yml up -d');
    console.error('   - Check logs: docker logs openml-mysql-local');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase().catch(console.error);
}

module.exports = { initDatabase };
