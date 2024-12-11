import express from 'express';
import * as cart from '../controllers/cart.js';
import authorise from '../middleware/userMiddelware.js';
import * as user from '../controllers/user.js';

export const cartRouter = express.Router();

//Routers for the cart
cartRouter.get('/cart', authorise(['user']), cart.viewCart);
cartRouter.post('/cart/add', authorise(['user']), cart.addToCart);
// cartRouter.post('/cart/update', cart.updateCart);
// cartRouter.post('/cart/order', cart.placeholder);
cartRouter.get('/orders/buy', authorise(['user']), cart.buyOrder);
cartRouter.get('/orders/sell', authorise(['user']), cart.sellOrder);
cartRouter.post('/sell-product', authorise(['user']), cart.sellProduct);
cartRouter.post('/buy-product', authorise(['user']), cart.buyProduct);
cartRouter.post('/cart/remove/:productId', authorise(['user']), cart.removeFromCart);
cartRouter.post('/cart/checkout', authorise(['user']), cart.proceedToCheckout);
cartRouter.post('/orders/cancel', authorise(['user']), cart.cancelOrder);

