import sql from '../config/db.js';


// Sorting Function

export function titleSort(products) {
    return products.sort((a, b) => a.title.localeCompare(b.title));
};

export function priceSortDecendingOrder(products) {
    return products.sort((a, b) => b.price - a.price);
};

export function priceSortAscendingOrder(products) {
    return products.sort((a, b) => a.price - b.price);
};

export function categoriesFilter(products, category) {
    let noMatchCounter = 0;
    products.forEach((product) => {
        if (product.category === category) {
            console.log(`title: ${product.title}`);
            console.log(`price: ${product.price}`);
            console.log(`description: ${product.description}`);
            console.log(`category: ${product.category}`);
            console.log('--------------------');
        } else {
            noMatchCounter++;
        }
    });
    if (noMatchCounter === products.length) {
        console.log(`No products found with the category: ${category}.`);
        console.log('--------------------');
    }
}

// Query Function

// Function to retrieve all products
export async function getProducts() {
    try { // try satement and catch statement are used to catch any error during the process
        // SQL query to retrieve all products
        const products = await sql`
        SELECT product_id, product_name, price, description, status, image_path, category_name, user_email, flag
        FROM products;`;
        // Return the products retrieved from the database
        return products;
    } catch (error) {
        console.error('Error retrieving products:', error);
        throw error;
    }
}

export async function getProductsByEmail(email) {

    try {
        // SQL query to retrieve all products
        const products = await sql`
        SELECT product_id, product_name, price, description, status, image_path, category_name, user_email, flag
        FROM products
        WHERE user_email = ${email};`;
        // Return the products retrieved from the database
        return products;
    } catch (error) {
        console.error('Error retrieving products:', error);
        throw error;
    }
}

// Function to retrieve all categories
export async function getCategory() {
    try { // try satement and catch statement are used to catch any error during the process
        // SQL query to retrieve all categories
        const categories = await sql`
        SELECT category_name, description
        FROM categories;`;
        // Return the categories retrieved from the database
        return categories;
    } catch (error) {
        console.error('Error retrieving categories:', error);
        throw error;
    }
}

// Function to find the product by id
export async function findProductById(id) {
    try {

        const product = await sql`
        SELECT * FROM products
        WHERE product_id = ${id};`;
        return product;
    } catch (error) {
        console.error('Error finding product:', error);
        throw error;
    }
}

export async function createProduct(product) {
    try {
        // Use the uploaded image path if available, otherwise set the default
        // SQL query to insert a new product with the image path
        await sql`
        INSERT INTO products (product_name, price, description, status, image_path, category_name, user_email, flag)
        VALUES (${product.product_name}, ${product.price}, ${product.description}, ${product.status}, ${product.image_path}, ${product.category_name}, ${product.user_email}, ${product.flag});`;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

// Test to see if the product from the data list on the terminal

// Function to retrieve and log all products
export async function retrieveAndLogProducts() {
    try {
        const products = await getProducts();
        console.log('Retrieved products:', products);
    } catch (error) {
        console.error('Failed to retrieve products:', error);
    }
}

export async function setAllProductWithDefaultImage() {
    try {
        // SQL query to set all products with default image
        await sql`
        UPDATE products
        SET image_path = '/img/default.jpg';`;
        console.log('Finish changing all image_path to default image');
    } catch (error) {
        console.error('Error setting all products with default image:', error);
        throw error;
    }
}

export async function createTrade(starterProductId, responderProductId) {
    const [trade] = await sql`
        INSERT INTO trades (starter_product_id, responder_product_id)
        VALUES (${starterProductId}, ${responderProductId})
        RETURNING trade_id;
    `;
    return trade.trade_id;
}


export async function getTradeById(id) {
    try {
        const trade = await sql`
          SELECT *
          FROM trades
          WHERE trade_id = ${id};`;
        return trade[0]; // Return the trade if found
    } catch (error) {
        console.error('Error fetching trade:', error);
        throw error;
    }
}

export async function getTradeByProducts(starterProductId, responderProductId) {
    try {
        const trade = await sql`
            SELECT * FROM trades
            WHERE starter_product_id = ${starterProductId}
            AND responder_product_id = ${responderProductId};`;

        return trade[0]; // Return the trade if it exists and status is 'onhold', otherwise null
    } catch (error) {
        console.error('Error checking trade by products:', error);
        throw error;
    }
}

export async function deleteProductById(id) {
    try {
        await sql`
          DELETE FROM products
          WHERE product_id = ${id};`;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export async function updateProduct(productId, updatedFields) {
    try {
        // Get the current product data from the database
        const currentProduct = await findProductById(productId);

        if (!currentProduct || currentProduct.length === 0) {
            throw new Error('Product not found');
        }

        const product = currentProduct[0];

        // Merge the existing product fields with the updated fields
        const updatedProduct = {
            product_name: updatedFields.product_name || product.product_name,
            price: updatedFields.price || product.price,
            description: updatedFields.description || product.description,
            category_name: updatedFields.category_name || product.category_name,
            status: updatedFields.status || product.status,
            image_path: updatedFields.image_path || product.image_path
        };

        // Perform the update in the database
        await sql`
            UPDATE products
            SET 
                product_name = ${updatedProduct.product_name},
                price = ${updatedProduct.price},
                description = ${updatedProduct.description},
                category_name = ${updatedProduct.category_name},
                status = ${updatedProduct.status},
                image_path = ${updatedProduct.image_path}
            WHERE product_id = ${productId};
        `;

        return updatedProduct; // Return the updated product
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}
