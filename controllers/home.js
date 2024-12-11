/**
* Renders the index page with the specified title.
* 
* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @param {Function} next - The next middleware function.
* @returns {Promise<void>} - A promise that resolves when the rendering is complete.
*/

import * as productUtil from '../utility/productUtil.js';
import jwt from 'jsonwebtoken';
import sql from "../config/db.js";


/*
If user logged in and verified with token --> display logout button, profile button

If user was not logged in and was not verified with token --> display login button
*/
export async function index(req, res, next) {

  const token = req.cookies.token;
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/home');
    } catch (err) {
      console.error(`Token invalid or expired: ${err.message}`);
      res.clearCookie('token');
    }
  }

  res.render('home', { title: 'Home', comp_name: 'Eco Exchange Campus', message: '' });
}

export async function home(req, res, next) {
  const categories = await productUtil.getCategory();
  const products = await productUtil.getProducts();
  const user = req.user;

  // Render the template with products data
  res.render("loggedIn_home", {
    title: "Home",
    user,
    products,
    categories,
    createProductMessage: '',
    buyOrderMessage: ''
  });
}