import request from 'supertest';
import { app } from '../app.js'; // Adjust the path as necessary
import sql from '../config/db.js';
import { beforeEach, afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Insert some test data before each test case
beforeEach(async () => {
    // Insert necessary data for users, products, categories, etc.
    await sql`
    INSERT INTO users (email, password_hash, fname, lname, phone_number, user_address, user_role)
    VALUES ('test.user@example.com', 'hashedpassword', 'Test', 'User', '1234567890', '123 Test St', 'user')
    ON CONFLICT (email) DO NOTHING;
  `;
    await sql`
    INSERT INTO categories (category_name, description)
    VALUES ('Test Category', 'A category for testing.')
    ON CONFLICT (category_name) DO NOTHING;
  `;
    await sql`
    INSERT INTO products (product_name, price, description, status, category_name, user_email, flag)
    VALUES ('Test Product', 199.99, 'A sample product for testing.', 'new', 'Test Category', 'test.user@example.com', 'SELL')
    ON CONFLICT (product_name) DO NOTHING;
  `;
});

afterEach(async () => {
    // Clean up test data after each test
    await sql`DELETE FROM feedback WHERE email = 'test.user@example.com';`;
    await sql`DELETE FROM products WHERE user_email = 'test.user@example.com';`;
    await sql`DELETE FROM categories WHERE category_name = 'Test Category';`;
    await sql`DELETE FROM users WHERE email = 'test.user@example.com';`;
});

// Tests for Cart Routes
describe('Cart Routes', () => {
    it('GET /cart should return the cart page for logged-in user', async () => {
        const response = await request(app)
            .get('/cart')
            .set('Cookie', 'token=valid-jwt-token')
            .expect(200);
        assert.ok(response.text.includes('Your Cart'), 'Cart page should display "Your Cart"');
    });

    it('POST /cart/add should add a product to the cart', async () => {
        const response = await request(app)
            .post('/cart/add')
            .set('Cookie', 'token=valid-jwt-token')
            .send({ productId: 1 }) // Replace with valid productId
            .expect(302); // Expect redirection after successful addition
        assert.strictEqual(response.header.location, '/cart', 'Should redirect to cart page');
    });

    it('POST /cart/remove/:productId should remove a product from the cart', async () => {
        const response = await request(app)
            .post('/cart/remove/1')
            .set('Cookie', 'token=valid-jwt-token')
            .expect(302); // Expect redirection after successful removal
        assert.strictEqual(response.header.location, '/cart', 'Should redirect to cart page');
    });
});

// Tests for Home Routes
describe('Home Routes', () => {
    it('GET / should return the home page', async () => {
        const response = await request(app).get('/').expect(200);
        assert.ok(response.text.includes('Home'), 'Home page should display "Home"');
    });

    it('GET /home should return logged-in home page', async () => {
        const response = await request(app)
            .get('/home')
            .set('Cookie', 'token=valid-jwt-token')
            .expect(200);
        assert.ok(response.text.includes('Home'), 'Logged-in home page should display "Home"');
    });
});

// Tests for Product Routes
describe('Product Routes', () => {
    it('GET /product-details/:id should return product details', async () => {
        const response = await request(app)
            .get('/product-details/1') // Replace with valid product ID
            .set('Cookie', 'token=valid-jwt-token')
            .expect(200);
        assert.ok(response.text.includes('Test Product'), 'Should display product details');
    });

    it('POST /create-product-submit should create a new product', async () => {
        const response = await request(app)
            .post('/create-product-submit')
            .set('Cookie', 'token=valid-jwt-token')
            .field('product_name', 'New Product')
            .field('price', 299.99)
            .field('description', 'New product description')
            .field('status', 'new')
            .field('category_name', 'Test Category')
            .expect(302);
        assert.strictEqual(response.header.location, '/home', 'Should redirect to home after product creation');
    });

    it('POST /trade/cancel should cancel a trade', async () => {
        const response = await request(app)
            .post('/trade/cancel')
            .set('Cookie', 'token=valid-jwt-token')
            .send({ tradeId: 1 }) // Replace with valid tradeId
            .expect(302);
        assert.strictEqual(response.header.location, '/trade/list', 'Should redirect to trade list after cancellation');
    });
});

// Tests for User Routes
describe('User Routes', () => {
    it('GET /login-form should return login form', async () => {
        const response = await request(app).get('/login-form').expect(200);
        assert.ok(response.text.includes('Login'), 'Login form should display "Login"');
    });

    it('POST /login-form/submit should log in the user', async () => {
        const response = await request(app)
            .post('/login-form/submit')
            .send({ email: 'test.user@example.com', password: 'hashedpassword' })
            .expect(302);
        assert.strictEqual(response.header.location, '/home', 'Should redirect to home after login');
    });

    it('GET /logout should log out the user', async () => {
        const response = await request(app).get('/logout').expect(302);
        assert.strictEqual(response.header.location, '/login-form', 'Should redirect to login form after logout');
    });
});

// Tests for Feedback Routes
describe('Feedback Routes', () => {
    it('GET /feedback-page/:productId should return feedback page', async () => {
        const response = await request(app)
            .get('/feedback-page/1') // Replace with valid productId
            .set('Cookie', 'token=valid-jwt-token')
            .expect(200);
        assert.ok(response.text.includes('Feedback'), 'Feedback page should display "Feedback"');
    });

    it('POST /create-feedback-submit should create a new feedback', async () => {
        const response = await request(app)
            .post('/create-feedback-submit')
            .set('Cookie', 'token=valid-jwt-token')
            .send({
                feedback_headline: 'Great Product!',
                feedback_description: 'I really liked this product.',
                rating_condition: 'Good',
                product_id: 1, // Replace with valid productId
            })
            .expect(302);
        assert.strictEqual(response.header.location, '/home', 'Should redirect to home after feedback creation');
    });
});
