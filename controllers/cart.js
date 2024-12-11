import * as userUtil from "../services/userService.js";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";
import * as productUtil from "../utility/productUtil.js";
import { createProduct } from "./product.js";

export async function sellOrder(req, res, next) {
  try {
    // Assuming user email is available in req.user
    const user_email = req.user.email;

    // Fetch all products sold by the user
    const products = await sql`
        SELECT * FROM products
        WHERE user_email = ${user_email} AND flag='SELL';
      `;

    // Render the sellOrder page, passing the products data
    res.render("sellOrder", {
      title: "Your Sells",
      user: req.user,
      products, // Pass the products to the view
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching products:", error);
    res.status(500).send("Failed to load your sell orders.");
  }
}

export async function sellProduct(req, res, next) {
  try {
    const {
      product_name,
      price,
      description,
      status,
      category_name,
      user_email,
    } = req.body;

    // Insert product into the database
    await sql`
              INSERT INTO products
                  (product_name, price, description, status, category_name, user_email, flag)
              VALUES
                  (${product_name}, ${price}, ${description}, ${status}, ${category_name}, ${user_email}, 'SELL');
          `;

    // Redirect to the buy page after successful insertion
    res.redirect("/orders/sell");
  } catch (error) {
    // Handle errors
    console.error("Error inserting product:", error);
    res.status(500).send("Failed to add product.");
  }
}

export async function buyOrder(req, res, next) {
  const products = await sql`
      SELECT * FROM products
      WHERE buy_user_email = ${req.user.email} AND flag='BUY';
      `;

  // If no product are ready to checkout redirect back to home page
  if (products.length === 0) {
    const categories = await productUtil.getCategory();
    const allProducts = await productUtil.getProducts();
    return res.render("loggedIn_home", {
      title: "Home",
      user: req.user,
      products: allProducts,
      categories,
      buyOrderMessage: 'You have not bought anything yet',
      createProductMessage: ''
    });
  }
  res.render("buyOrder", { title: "Your Purchases", user: req.user, products, message: '' });
}

export async function buyProduct(req, res, next) {
  try {
    // Get the product field from the form data
    const { product } = req.body;

    // Convert product ID to integer
    const productId = parseInt(product, 10);

    console.log(productId, req.user.email);
    // Update the product to set the user_email to the currently logged-in user's email
    const updatedProduct = await sql`
    UPDATE products
    SET buy_user_email = ${req.user.email}, flag = 'BUY', cart_user_email = NULL
    WHERE product_id = ${productId}
    RETURNING *;
`;

    const products = await sql`
    SELECT * FROM products
    WHERE buy_user_email = ${req.user.email} AND flag='BUY';
    `;




    // Check if the product was successfully updated
    if (updatedProduct.length > 0) {
      // Render the buyOrder page, passing the updated product data
      res.render("buyOrder", {
        title: "Buy Product",
        user: req.user,
        products: products, // Pass the updated product name
      });
    } else {
      res.status(404).send("Product not found or update failed.");
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating product ownership:", error);
    res.status(500).send("Failed to update product: " + error.message);
  }
}

export async function viewCart(req, res, next) {
  try {
    // Fetch all products in the cart
    const products = await sql`
    SELECT * FROM products
    WHERE cart_user_email = ${req.user.email} AND flag = 'CART';
    `;

    res.render("cart", {
      title: "Cart",
      user: req.user,
      products: products, // Pass the products in the cart to the template
    });
  } catch (error) {
    console.error("Error updating product ownership:", error);
    res.status(500).send("Failed to update product: " + error.message);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { product } = req.body;
    const productId = parseInt(product, 10);
    const userEmail = req.user.email;

    // Check if the email exists in the users table
    const user = await sql`
      SELECT * FROM users WHERE email = ${userEmail};
    `;

    if (user.length === 0) {
      return res.status(400).send("User email does not exist.");
    }

    // Update the product to set the cart_user_email
    const updatedProduct = await sql`
      UPDATE products
      SET cart_user_email = ${userEmail}, flag = 'CART'
      WHERE product_id = ${productId}
      RETURNING *;
    `;

    // Fetch all products in the cart
    const products = await sql`
      SELECT * FROM products WHERE cart_user_email = ${userEmail} AND flag = 'CART';
    `;

    if (updatedProduct.length > 0) {
      res.render("cart", {
        title: "Cart",
        user: req.user,
        products,
      });
    } else {
      res.status(404).send("Product not found or update failed.");
    }
  } catch (error) {
    console.error("Error updating product ownership:", error);
    res.status(500).send("Failed to update product: " + error.message);
  }
}

// Remove product from cart (flag back to 'SELL')
export async function removeFromCart(req, res, next) {
  try {
    // Get the product ID from the request parameters
    const productId = parseInt(req.params.productId, 10);

    // Update the product to set the flag back to 'SELL'
    const updatedProduct = await sql`
      UPDATE products
      SET flag = 'SELL', cart_user_email = NULL
      WHERE product_id = ${productId} AND cart_user_email = ${req.user.email}
      RETURNING *;
    `;

    if (updatedProduct.length > 0) {
      // Fetch all remaining products in the cart
      const products = await sql`
        SELECT * FROM products
        WHERE cart_user_email = ${req.user.email} AND flag = 'CART';
      `;

      // Re-render the cart page
      res.render("cart", {
        title: "Cart",
        user: req.user,
        products,
      });
    } else {
      res.status(404).send("Product not found or update failed.");
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).send("Failed to remove product.");
  }
}

// Proceed to checkout (flag all 'CART' products to 'BUY')
export async function proceedToCheckout(req, res, next) {
  try {
    // Update all 'CART' products for the current user to 'BUY'
    const updatedProducts = await sql`
      UPDATE products
      SET flag = 'BUY', cart_user_email = NULL, buy_user_email = ${req.user.email}
      WHERE cart_user_email = ${req.user.email} AND flag = 'CART'
      RETURNING *;
    `;

    if (updatedProducts.length > 0) {
      // Redirect to the order summary page after checkout
      res.redirect('/orders/buy');
    } else {
      res.status(404).send("No products in the cart or update failed.");
    }
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("Failed to proceed to checkout.");
  }
}

export async function cancelOrder(req, res, next) {
  try {
    // Update all 'BUY' products for the current user to 'SELL'
    const updatedProducts = await sql`
      UPDATE products
      SET flag = 'SELL', buy_user_email = NULL
      WHERE flag = 'BUY' AND buy_user_email = ${req.user.email}
      RETURNING *;
    `;

    if (updatedProducts.length > 0) {
      // Redirect to the sell order page after cancelling the order
      res.redirect('/home');
    } else {
      res.status(404).send("No products in the buy list or update failed.");
    }
  } catch (error) {
    console.error("Error during cancel order:", error);
    res.status(500).send("Failed to cancel the order.");
  }
}
