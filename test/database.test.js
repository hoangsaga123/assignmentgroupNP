import sql from '../config/db.js'; // Your db connection
import test from 'node:test';
import assert from 'node:assert/strict';

// Test table names and associated column keys
const testTableName = {
    users: {
        email: 'test.user@example.com',
        password_hash: 'hashedpassword',
        fname: 'Test',
        lname: 'User',
        phone_number: '1234567890',
        user_address: '123 Test St',
        user_role: 'user'
    },
    categories: {
        category_name: 'Test Category',
        description: 'A category for testing.'
    },
    products: {
        product_name: 'Test Product',
        price: 199.99,
        description: 'A sample product for testing.',
        status: 'new',
        category_name: 'Test Category', // Foreign key
        user_email: 'test.user@example.com', // Foreign key
        flag: 'SELL'
    },
    feedback: {
        feedback_headline: 'Test Feedback',
        feedback_description: 'This is feedback for testing.',
        rating_condition: 'Good',
        email: 'test.user@example.com', // Foreign key
        product_id: null // Set after inserting the product
    },
    trades: {
        trade_status: 'onhold',
        trade_accepted: false,
        starter_product_id: null, // Set after product insert
        responder_product_id: null // Set after product insert
    }
};

// Function to check if a table exists
async function checkIfTableExists(tableName) {
    const result = await sql`
    SELECT EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ${tableName}
    );
  `;
    return result[0].exists; // Returns true or false
}

// Test users table (users are required to run first inorder for the other to function properly because of foreign key constraints)
test('Test for inserting and retrieving user', async (t) => {
    const tableExists = await checkIfTableExists('users');
    assert.ok(tableExists, 'The users table should exist before running the test');

    // Insert new user
    await sql`
    INSERT INTO users (email, password_hash, fname, lname, phone_number, user_address, user_role)
    VALUES (${testTableName.users.email}, ${testTableName.users.password_hash}, 
      ${testTableName.users.fname}, ${testTableName.users.lname}, 
      ${testTableName.users.phone_number}, ${testTableName.users.user_address}, 
      ${testTableName.users.user_role});
  `;

    // Retrieve the user
    const user = await sql`SELECT * FROM users WHERE email = ${testTableName.users.email};`;

    // Assertions for every column in the users table
    assert.strictEqual(user[0].email, testTableName.users.email, 'The user email should match');
    assert.strictEqual(user[0].password_hash, testTableName.users.password_hash, 'The password hash should match');
    assert.strictEqual(user[0].fname, testTableName.users.fname, 'The first name should match');
    assert.strictEqual(user[0].lname, testTableName.users.lname, 'The last name should match');
    assert.strictEqual(user[0].phone_number, testTableName.users.phone_number, 'The phone number should match');
    assert.strictEqual(user[0].user_address, testTableName.users.user_address, 'The address should match');
    assert.strictEqual(user[0].user_role, testTableName.users.user_role, 'The role should be "user"');
});

// Test categories table
test('Test for inserting and retrieving category', async (t) => {
    const tableExists = await checkIfTableExists('categories');
    assert.ok(tableExists, 'The categories table should exist before running the test');

    // Insert new category
    await sql`
    INSERT INTO categories (category_name, description)
    VALUES (${testTableName.categories.category_name}, ${testTableName.categories.description});
  `;

    // Retrieve the category
    const category = await sql`SELECT * FROM categories WHERE category_name = ${testTableName.categories.category_name};`;

    // Assertions for every column in the categories table
    assert.ok(category.length > 0, 'Category should be retrieved');
    assert.strictEqual(category[0].category_name, testTableName.categories.category_name, 'The category name should match');
    assert.strictEqual(category[0].description, testTableName.categories.description, 'The description should match');
});

// Test products table
test('Test for inserting and retrieving product', async (t) => {
    const tableExists = await checkIfTableExists('products');
    assert.ok(tableExists, 'The products table should exist before running the test');

    // Insert new product
    await sql`
      INSERT INTO products (product_name, price, description, status, category_name, user_email, flag)
      VALUES (${testTableName.products.product_name}, ${testTableName.products.price}, 
        ${testTableName.products.description}, ${testTableName.products.status}, 
        ${testTableName.products.category_name}, ${testTableName.products.user_email}, 
        ${testTableName.products.flag});
    `;

    // Retrieve the product
    const product = await sql`SELECT * FROM products WHERE product_name = ${testTableName.products.product_name};`;

    // Assertions for every column in the products table
    assert.ok(product.length > 0, 'Test Product should exist in the retrieved products');
    assert.strictEqual(product[0].product_name, testTableName.products.product_name, 'The product name should be "Test Product"');
    assert.strictEqual(parseFloat(product[0].price), testTableName.products.price, 'The price should be 199.99');
    assert.strictEqual(product[0].description, testTableName.products.description, 'The description should match');
    assert.strictEqual(product[0].status, testTableName.products.status, 'The status should be "new"');
    assert.strictEqual(product[0].category_name, testTableName.products.category_name, 'The category name should match');
    assert.strictEqual(product[0].user_email, testTableName.products.user_email, 'The user email should match');
    assert.strictEqual(product[0].flag, testTableName.products.flag, 'The flag should be "SELL"');

    // Set product ID in feedback and trades table for foreign key constraint
    testTableName.feedback.product_id = product[0].product_id;
    testTableName.trades.starter_product_id = product[0].product_id;
});

// Test feedback table (depends on products and users)
test('Test for inserting and retrieving feedback', async (t) => {
    const tableExists = await checkIfTableExists('feedback');
    assert.ok(tableExists, 'The feedback table should exist before running the test');

    // Insert new feedback
    await sql`
    INSERT INTO feedback (feedback_headline, feedback_description, rating_condition, email, product_id)
    VALUES (${testTableName.feedback.feedback_headline}, ${testTableName.feedback.feedback_description}, 
      ${testTableName.feedback.rating_condition}, ${testTableName.feedback.email}, 
      ${testTableName.feedback.product_id});
  `;

    // Retrieve the feedback
    const feedback = await sql`SELECT * FROM feedback WHERE feedback_headline = ${testTableName.feedback.feedback_headline};`;

    // Assertions for every column in the feedback table
    assert.ok(feedback.length > 0, 'Feedback should be retrieved');
    assert.strictEqual(feedback[0].feedback_headline, testTableName.feedback.feedback_headline, 'The feedback headline should match');
    assert.strictEqual(feedback[0].feedback_description, testTableName.feedback.feedback_description, 'The feedback description should match');
    assert.strictEqual(feedback[0].rating_condition, testTableName.feedback.rating_condition, 'The rating condition should match');
    assert.strictEqual(feedback[0].email, testTableName.feedback.email, 'The user email should match');
    assert.strictEqual(feedback[0].product_id, testTableName.feedback.product_id, 'The product ID should match the inserted product ID');
});

// Test trades table
test('Test for inserting and retrieving a trade', async (t) => {
    const tableExists = await checkIfTableExists('trades');
    assert.ok(tableExists, 'The trades table should exist before running the test');

    // Insert another product for responder
    await sql`
      INSERT INTO products (product_name, price, description, status, category_name, user_email, flag)
      VALUES ('Responder Product', 299.99, 'A product to test trades', 'new', 'Test Category', 
              'test.user@example.com', 'SELL');
    `;
    const responderProduct = await sql`SELECT product_id FROM products WHERE product_name = 'Responder Product';`;
    testTableName.trades.responder_product_id = responderProduct[0].product_id;

    // Insert new trade
    await sql`
    INSERT INTO trades (starter_product_id, responder_product_id)
    VALUES (${testTableName.trades.starter_product_id}, ${testTableName.trades.responder_product_id});
  `;

    // Retrieve the trade
    const trade = await sql`
    SELECT * FROM trades
    WHERE starter_product_id = ${testTableName.trades.starter_product_id}
    AND responder_product_id = ${testTableName.trades.responder_product_id};
  `;

    // Assertions for every column in the trades table
    assert.ok(trade.length > 0, 'Trade should be retrieved');
    assert.strictEqual(trade[0].starter_product_id, testTableName.trades.starter_product_id, 'The starter product ID should match');
    assert.strictEqual(trade[0].responder_product_id, testTableName.trades.responder_product_id, 'The responder product ID should match');
    assert.strictEqual(trade[0].trade_status, testTableName.trades.trade_status, 'The trade status should match');
    assert.strictEqual(trade[0].trade_accepted, testTableName.trades.trade_accepted, 'The trade accepted status should match');
});

// Clean up inserted test data
test('Clean up test data', async (t) => {
    // Delete feedback
    await sql`DELETE FROM feedback WHERE email = ${testTableName.feedback.email};`;
    // Delete trades
    await sql`DELETE FROM trades WHERE starter_product_id = ${testTableName.trades.starter_product_id};`;
    // Delete products
    await sql`DELETE FROM products WHERE user_email = ${testTableName.products.user_email};`;
    // Delete category
    await sql`DELETE FROM categories WHERE category_name = ${testTableName.categories.category_name};`;
    // Delete user
    await sql`DELETE FROM users WHERE email = ${testTableName.users.email};`;
});
