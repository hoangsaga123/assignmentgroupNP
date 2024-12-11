/**
* Renders the index page with the specified title.
* 
* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @param {Function} next - The next middleware function.
* @returns {Promise<void>} - A promise that resolves when the rendering is complete.
*/
import * as productUtil from '../utility/productUtil.js';
import sql from '../config/db.js';
import path from 'path';
import multer from 'multer';
import { filterEmailFromUniqueCharacter, filterFileName } from '../utility/createFolderUtil.js';
import { buyOrder } from './cart.js';
import { get } from 'http';

// Controller for product detail page
export async function productDetail(req, res, next) {
    // Extract the value from the request parameters and validate if it an integer
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send('Invalid product ID');
    }

    const user = req.user;

    // Find the product by the id provided using the utility function
    const product = await productUtil.findProductById(productId);
    // If the product is not found, return a 404 status
    if (!product) {
        return res.status(404).send('Product not found');
    }

    const list_feedback = await sql`
        SELECT * FROM feedback
        WHERE product_id = ${productId}
        ORDER BY feedback_id DESC;
    `;

    res.render('productDetail', { product: product[0], price: 300, list_feedback, user });
}


// Controller function to process the submit request
export async function createProductSubmit(req, res, next) {
    const user = req.user;
    const sanitizedEmail = filterEmailFromUniqueCharacter(user.email);
    // Extract data from the request body
    const { product_name, price, description, category_name, status } = req.body;


    // Validator to ensure all required fields are filled out(I will like likely delete this and validate through the dom instead)
    if (!product_name || !price || !category_name || !status) {
        const categories = await productUtil.getCategory();
        // Render with a validation error message
        return res.render('createProduct', {
            title: 'Create Product',
            message: 'All required fields must be filled out.',
            categories
        });
    }
    //const sanitizedFileName = filterFileName(req.file.filename);

    let imagePath = '';


    // Check if a file was uploaded
    if (req.file && req.file.filename) {

        // Create image path
        const sanitizedFileName = filterFileName(req.file.filename);
        imagePath = `/img/users/${sanitizedEmail}/${sanitizedFileName}`;
    } else {

        // Else set image path as default image
        imagePath = '/img/default.jpg';
    }

    // Prepare product data to insert into the database
    const newProduct = {
        product_name,
        price,
        description,
        category_name,
        status,
        user_email: user.email,
        image_path: imagePath,
        flag: 'SELL'
    };


    // If an image is not submit by the user, use the default image
    if (newProduct.image_path == null || newProduct.image_path == '') {
        newProduct.image_path = "/img/default.jpg";
    }

    try {
        // Create the product in the database
        await productUtil.createProduct(newProduct);
        const categories = await productUtil.getCategory();
        const products = await productUtil.getProducts();
        // Redirect to home page and pass the success message
        res.render('loggedIn_home', {
            title: 'Home',
            comp_name: 'Eco Exchange Campus',
            user,
            products,
            categories,
            createProductMessage: `${product_name} has been successfully listed`,
            buyOrderMessage: ''
        });
    } catch (error) {
        console.error('Error creating product:', error);
        const categories = await productUtil.getCategory(); // Re-populate categories for the form

        // Redirect back to the create product form with a failure message
        return res.render('createProduct', {
            title: 'Create Product',
            message: 'Error creating product. Please try again later.',
            categories
        });
    }
}

// Controller for createProduct page
export async function createProduct(req, res, next) {
    try {
        const categories = await productUtil.getCategory();
        const user = req.user;
        const products = await productUtil.getProductsByEmail(user.email);
        // Ensure message is defined, even if empty
        res.render('createProduct', {
            title: 'Listing New Product',
            user,
            categories,
            products,
            message: '' // Pass an empty string as default
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal server error');
    }
}

export async function listingHistory(req, res, next) {
    const user = req.user;
    const products = await sql`
        SELECT * FROM products
        WHERE user_email = ${user.email}
        ORDER BY product_id DESC;
    `;
    res.render('listingHistory', { title: 'Listing History', user, products });
}

export async function selectProductToTrade(req, res, next) {
    try {
        // Convert id to int
        const productId = parseInt(req.params.id, 10);
        if (isNaN(productId) || productId <= 0) {
            return res.status(400).send('Invalid product ID');
        }

        // Get data from the database
        const user = req.user;
        const productTrade = await productUtil.findProductById(productId);
        const products = await sql`
            SELECT * FROM products
            WHERE user_email = ${user.email}
            ORDER BY product_id DESC;
        `;

        res.render('tradeProduct', { user, products, productTrade: productTrade[0] });
    } catch (error) {
        console.error('Error fetching products for trade:', error);
        res.status(500).send('Internal server error');
    }
}


export async function startTrade(req, res, next) {
    try {
        // Extract starter and responder product IDs from the route parameters
        const starterProductId = parseInt(req.params.id, 10);
        const responderProductId = parseInt(req.params.productTradeId, 10);

        // Check if the IDs are valid integers
        if (isNaN(starterProductId) || starterProductId <= 0 || isNaN(responderProductId) || responderProductId <= 0) {
            return res.status(400).send('Invalid product IDs');
        }
        const existingTrade = await productUtil.getTradeByProducts(starterProductId, responderProductId);
        // Create the trade using utility function

        let trade = null;
        if (!existingTrade || existingTrade === undefined) {
            const tradeId = await productUtil.createTrade(starterProductId, responderProductId);
            trade = await productUtil.getTradeById(tradeId);
        } else {
            trade = existingTrade;
        }

        // Fetch the product details again
        const user = req.user;
        const starterProduct = await productUtil.findProductById(starterProductId);
        const responderProduct = await productUtil.findProductById(responderProductId);



        // Render the tradeProduct page again with the trade details
        res.render('startTrade', {
            user,
            product: starterProduct[0],
            productTrade: responderProduct[0],
            trade
        });
    } catch (error) {
        console.error('Error starting trade:', error);
        res.status(500).send('Internal server error');
    }
}
// Cancel the trade
export async function cancelTrade(req, res, next) {
    const tradeId = parseInt(req.body.cancelTrade, 10); // Use the trade ID from the form

    try {
        const updatedTrade = await sql`
            UPDATE trades
            SET trade_status = 'cancelled'
            WHERE trade_id = ${tradeId}
            RETURNING *;
        `;

        if (updatedTrade.length > 0) {
            // Redirect to the trade details page
            res.redirect(`/trade/${updatedTrade[0].starter_product_id}/${updatedTrade[0].responder_product_id}`);
        } else {
            res.status(404).send('Trade not found or update failed.');
        }
    } catch (error) {
        console.error('Error cancelling trade:', error);
        res.status(500).send('Failed to cancel trade.');
    }
}

// Finalize the trade
export async function finalizeTrade(req, res, next) {
    const tradeId = parseInt(req.body.finaliseTrade, 10); // Use the trade ID from the form

    if (isNaN(tradeId) || tradeId <= 0) {
        // Return a 400 Bad Request response if the tradeId is invalid
        return res.status(400).send('Invalid trade ID.');
    }

    try {
        const updatedTrade = await sql`
            UPDATE trades
            SET trade_status = 'completed', trade_accepted = TRUE
            WHERE trade_id = ${tradeId}
            RETURNING *;`;

        await sql`
            UPDATE products
            SET flag = 'TRADE'
            WHERE product_id IN (${updatedTrade[0].starter_product_id}, ${updatedTrade[0].responder_product_id});`;


        if (updatedTrade.length > 0) {
            // Redirect to the trade details page
            res.redirect(`/trade/${updatedTrade[0].starter_product_id}/${updatedTrade[0].responder_product_id}`);
        } else {
            res.status(404).send('Trade not found or update failed.');
        }
    } catch (error) {
        console.error('Error finalizing trade:', error);
        res.status(500).send('Failed to finalize trade.');
    }
}

export async function listTrades(req, res, next) {
    const user = req.user;
    const trades = await sql`
        SELECT * FROM trades
        WHERE starter_product_id IN (SELECT product_id FROM products WHERE user_email = ${user.email})
        OR responder_product_id IN (SELECT product_id FROM products WHERE user_email = ${user.email})
        ORDER BY trade_id DESC;`;

    res.render('listingTrade', { user, trades });
}

export async function deleteProduct(req, res, next) {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send('Invalid product ID');
    }
    try {
        await productUtil.deleteProductById(productId);

        const categories = await productUtil.getCategory();
        const products = await productUtil.getProducts();
        const user = req.user;

        // Render the template with products data
        res.render("loggedIn_home", {
            title: "Home",
            user,
            products,
            categories,
            createProductMessage: 'Successfully Deleted Product',
            buyOrderMessage: ''
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal server error');
    }
}

// Edit product controller
export async function editProduct(req, res, next) {
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send('Invalid product ID');
    }

    try {
        const product = await productUtil.findProductById(productId);
        const categories = await productUtil.getCategory();
        const user = req.user;
        const products = await productUtil.getProductsByEmail(user.email);
        res.render('editProduct', { user, currentProduct: product[0], categories, products, message: '' });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal server error');
    }
}

// Controller function to handle product edit form submission
export async function editProductSubmit(req, res, next) {
    const user = req.user;
    const productId = parseInt(req.body.product_id, 10);

    if (isNaN(productId) || productId <= 0) {
        return res.status(400).send('Invalid product ID');
    }

    // Extract data from the request body
    const { product_name, price, description, category_name, status } = req.body;

    // Prepare the fields for updating, only including those that are filled
    const updatedFields = {};

    if (product_name) updatedFields.product_name = product_name;
    if (price) updatedFields.price = price;
    if (description) updatedFields.description = description;
    if (category_name) updatedFields.category_name = category_name;
    if (status) updatedFields.status = status;

    // If a file was uploaded, include the image path in updated fields
    if (req.file && req.file.filename) {
        const sanitizedEmail = filterEmailFromUniqueCharacter(user.email);
        const sanitizedFileName = filterFileName(req.file.filename);
        updatedFields.image_path = `/img/users/${sanitizedEmail}/${sanitizedFileName}`;
    }

    try {
        // Call the update function to update the product in the database
        await productUtil.updateProduct(productId, updatedFields);

        // Fetch updated products and categories for display
        const products = await productUtil.getProductsByEmail(user.email);
        const categories = await productUtil.getCategory();

        // Render the home page with a success message
        return res.render('loggedIn_home', {
            title: 'Home',
            comp_name: 'Eco Exchange Campus',
            user,
            products,
            categories,
            createProductMessage: `${updatedFields.product_name || 'Product'} has been successfully updated.`,
            buyOrderMessage: ''
        });
    } catch (error) {
        console.error('Error updating product:', error);
        const product = await productUtil.findProductById(productId);
        const categories = await productUtil.getCategory();

        // Render the edit form again with an error message
        return res.render('editProduct', {
            title: 'Edit Product',
            user,
            currentProduct: product[0],
            categories,
            message: 'Error updating product. Please try again later.'
        });
    }
}
