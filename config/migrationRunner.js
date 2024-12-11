// migrationRunner.js

import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import { createUserFolder, deleteAllUserFolder } from '../utility/createFolderUtil.js';
import bcrypt from 'bcrypt';
import * as hash from '../utility/password-hash.js';

// Database connection configuration
const sql = postgres({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// Get the directory name for the migrations folder
const migrationsDir = path.join(import.meta.dirname, '../migration');


async function applyMigrations() {
  try {
    // Get all SQL files in the migrations directory
    const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));

    // Sort files by name to ensure they are applied in the correct order
    files.sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sqlQuery = fs.readFileSync(filePath, 'utf8');

      console.log(`Applying migration: ${file}`);
      await sql.unsafe(sqlQuery);
      console.log(`Migration ${file} applied successfully.`);
    }

    console.log('All migrations applied successfully.');

    // This function will automatically create a folder for each user in the public/img/users if user is created when migrate
    // Get all users
    const users = await sql`SELECT email, password_hash FROM users`;
    // Check if user folders exist
    if (users && users.length > 0) {

      console.log('Creating folders for each user...');
      // Create a folder for each user
      for (const user of users) {
        console.log(`Creating folder for user: ${user.email}`);
        await createUserFolder(user.email);  // Create folder for each user
      }
      console.log('All user folders created successfully.');

      console.log('Hashing passwords for all users...');
      for (const user of users) {
        // Hash the existing user password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(user.password_hash, salt); // Hash the password

        // Update the user's password with the hashed password
        await sql`UPDATE users SET password_hash = ${hashedPassword} WHERE email = ${user.email}`;
        console.log(`Password hashed for user: ${user.email}`);
      }
      console.log('All user password hashed successfully.');
    }

  } catch (err) {
    console.error('Error applying migrations:', err);
  } finally {
    await sql.end();
  }
}

async function dropDatabase() {
  try {
    console.log('Dropping all tables...');

    // Get a list of all tables in the database
    const tables = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
      `;

    // Drop each table
    for (const table of tables) {
      await sql.unsafe(`DROP TABLE IF EXISTS ${table.table_name} CASCADE;`);
      console.log(`Dropped table: ${table.table_name}`);
    }

    console.log('All tables dropped successfully.');

    // Delete all user images in the public/img/users directory
    await deleteAllUserFolder();

  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    await sql.end();
  }
}

// Handle command-line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Please provide a command: migrate or drop');
  process.exit(1);
}

const command = args[0];

if (command === 'migrate') {
  applyMigrations();
} else if (command === 'destroy') {
  dropDatabase();
} else {
  console.log('Invalid command. Use "migrate" to apply migrations or "drop" to drop all tables.');
  process.exit(1);
}
