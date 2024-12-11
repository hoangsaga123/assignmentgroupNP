import { describe, it } from "mocha";
import { app } from "../app.js"; // Importing the app
import http from "http";
import assert from "assert";
import sql from '../config/db.js';

// Helper function to make HTTP requests
const makeRequest = (method, path, callback, body = null) => {
    const options = {
        hostname: "localhost",
        port: 3000, 
        path: path,
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
            data += chunk;
        });
        res.on("end", () => {
            callback(res, data);
        });
    });

    if (body) {
        req.write(JSON.stringify(body));
    }

    req.end();
};

// Test cases
describe("Eco Exchange App Test Suite", () => {

    // Test: Home Page Rendering for Unauthenticated Users
    it("should render the home page for unauthenticated users", (done) => {
        makeRequest("GET", "/", (res, data) => {
            assert.strictEqual(res.statusCode, 200);
            assert.ok(data.includes("About the Eco Campus Exchange Project"));
            done();
        });
    });

    // Test: Redirect to Login Page for Unauthenticated Users on Home
    it("should redirect to login page for unauthenticated users accessing /home", (done) => {
        makeRequest("GET", "/home", (res) => {
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/login-form");
            done();
        });
    });

    // Test: Login Form Page Rendering
    it("should render the login form page", (done) => {
        makeRequest("GET", "/login-form", (res, data) => {
            assert.strictEqual(res.statusCode, 200);
            assert.ok(data.includes("Login"));
            done();
        });
    });

    // Test: Successful Login with Valid Credentials (Highness)
    it("should login successfully with valid credentials (john)", (done) => {
        makeRequest("POST", "/login-form/submit", (res) => {
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/home");
            done();
        }, { email: "john@example.com", password: "pass123" });
    });

    // Test: Successful Login with Valid Credentials (Test User)
    it("should login successfully with valid credentials (Test User)", (done) => {
        makeRequest("POST", "/login-form/submit", (res) => {
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/home");
            done();
        }, { email: "test@test.com", password: "test" });
    });

    // Test: Logout Functionality
    it("should logout successfully and redirect to the home page", (done) => {
        makeRequest("GET", "/logout", (res) => {
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/");
            done();
        });
    });

    // Test: Home Page Content After Login
    it("should render the home page with content after login", (done) => {
        makeRequest("GET", "/home", (res, data) => {
            assert.strictEqual(res.statusCode, 200);
            assert.ok(data.includes("Available Products for Sale"));
            done();
        });
    });

    // Test: Adding Products to Cart (Redirect Test)
    it("should redirect to cart after adding a product", (done) => {
        makeRequest("POST", "/cart/add", (res) => {
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/cart/add");
            done();
        }, { product: "1" }); // Assuming product ID 1
    });

    // Test: Cart Page Content Verification
    it("should display the cart page with correct content", (done) => {
        makeRequest("GET", "/cart/add", (res, data) => {
            assert.strictEqual(res.statusCode, 200);
            assert.ok(data.includes("Your Cart"));
            assert.ok(data.includes("Checkout"));
            done();
        });
    });

    // Test: Checkout Redirect
    it("should redirect to buy product page after checkout", (done) => {
        makeRequest("POST", "/buy-product", (res) => {
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/buy-product");
            done();
        }, { product: "1" }); // Assuming product ID 1
    });

    // Test: Order Page Content Verification
    it("should display the order page with correct content", (done) => {
        makeRequest("GET", "/buy-product", (res, data) => {
            assert.strictEqual(res.statusCode, 200);
            assert.ok(data.includes("Your Orders"));
            assert.ok(data.includes("Ordered on"));
            done();
        });
    });

    // Test: Sell Product Page Content
    it("should display the sell product page", (done) => {
        makeRequest("GET", "/orders/sell", (res, data) => {
            assert.strictEqual(res.statusCode, 200);
            assert.ok(data.includes("List a New Item for Sale"));
            done();
        });
    });

    // Test: Sell Product Flow
    it("should redirect to sell orders page after listing a product", (done) => {
        makeRequest("POST", "/sell-product", (res) => {
            assert.strictEqual(res.statusCode, 302);
            assert.strictEqual(res.headers.location, "/orders/sell");
            done();
        }, { product_name: "Test Product", price: 100 });
    });

});
