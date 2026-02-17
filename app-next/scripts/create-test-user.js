#!/usr/bin/env node
/**
 * Create Test User Script
 *
 * Creates a test user matching the production Flask schema for backward compatibility.
 *
 * Usage: node scripts/create-test-user.js [email] [password] [confirmed]
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'openml',
  password: process.env.DB_PASSWORD || 'openml_local_pass',
  database: process.env.DB_NAME || 'openml_local',
};

async function createTestUser(email, password, confirmed = true) {
  let connection;

  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected\n');

    // Check if user already exists
    const [existing] = await connection.execute(
      'SELECT id, email FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log(`⚠️  User with email ${email} already exists (ID: ${existing[0].id})`);
      console.log('💡 To delete: docker exec openml-mysql-local mysql -u openml -popenml_local_pass openml_local \\');
      console.log(`   -e "DELETE FROM users WHERE email = '${email}';"`);
      process.exit(1);
    }

    // Hash password with bcrypt (matching Next.js registration)
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract username from email
    const username = email.split('@')[0];

    // Generate activation token (for legacy compatibility)
    const activationCode = crypto.randomBytes(16).toString('hex');
    const now = Math.floor(Date.now() / 1000);

    // Create user (LEGACY SCHEMA - matches Flask production)
    console.log('👤 Creating user...');
    const [result] = await connection.execute(
      `INSERT INTO users (
        username, password, email, first_name, last_name,
        active, activation_code, created_on,
        ip_address, company, phone, country, image, bio, core,
        external_source, external_id, forgotten_password_code, forgotten_password_time,
        remember_code, activation_selector, forgotten_password_selector, remember_selector,
        last_login
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        hashedPassword,
        email,
        'Test',
        'User',
        confirmed ? 1 : 0, // active (1 = confirmed, 0 = pending)
        activationCode,
        now,
        '127.0.0.1',
        '0000', // company
        '0000', // phone
        '0000', // country
        '0000', // image
        'No Bio', // bio
        'false', // core
        '0000', // external_source
        '0000', // external_id
        '0000', // forgotten_password_code
        '0000', // forgotten_password_time
        '0000', // remember_code
        '0000', // activation_selector
        '0000', // forgotten_password_selector
        '0000', // remember_selector
        0, // last_login
      ]
    );

    const userId = result.insertId;

    // Assign to default group (2 = user)
    const [maxIdResult] = await connection.execute(
      'SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users_groups'
    );
    const nextGroupId = maxIdResult[0].next_id;
    await connection.execute(
      'INSERT INTO users_groups (id, user_id, group_id) VALUES (?, ?, ?)',
      [nextGroupId, userId, 2]
    );

    console.log('\n✅ Test user created successfully!\n');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Username:', username);
    console.log('✓  Email Confirmed:', confirmed ? 'Yes' : 'No');
    console.log('🆔 User ID:', userId);
    console.log('👥 Group: user (ID: 2)');

    console.log('\n🌐 Login at: http://localhost:3050/auth/sign-in');
    console.log('📝 Schema: Legacy Flask schema (backward compatible)');

  } catch (error) {
    console.error('\n❌ Error creating test user:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const email = args[0] || 'test@example.com';
const password = args[1] || 'testpassword123';
const confirmed = args[2] !== 'false'; // default true, unless explicitly false

if (require.main === module) {
  console.log('🚀 Creating test user...\n');
  createTestUser(email, password, confirmed).catch(console.error);
}

module.exports = { createTestUser };
