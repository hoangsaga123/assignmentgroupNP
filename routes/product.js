import express from 'express';
import * as product from '../controllers/product.js';
import authorise from '../middleware/userMiddelware.js';
import upload from '../middleware/productMiddleware.js';
import multer from 'multer';

export const productRouter = express.Router()

// Below are all the routes for the product

// Param Route
productRouter.get('/product-details/:id', authorise(['user']), product.productDetail);
productRouter.get('/trade/select/:id', authorise(['user']), product.selectProductToTrade);
productRouter.get('/trade/:id/:productTradeId', authorise(['user']), product.startTrade);
productRouter.get('/product-detail/delete/:id', authorise(['user']), product.deleteProduct);
productRouter.get('/product-detail/edit/:id', authorise(['user']), product.editProduct);


// Router with the middleware
productRouter.post('/create-product-submit', authorise(['user']), (req, res, next) => {
    // Use the multer middleware to handle file upload
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send('File upload error: ' + err.message);
        } else if (err) {
            return res.status(400).send('Error: ' + err.message);
        }

        // Continue to the product creation logic
        product.createProductSubmit(req, res, next);
    });
});

productRouter.post('/edit-product-submit', authorise(['user']), (req, res, next) => {
    // Use the multer middleware to handle file upload
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send('File upload error: ' + err.message);
        } else if (err) {
            return res.status(400).send('Error: ' + err.message);
        }
        // Continue to the product creation logic
        product.editProductSubmit(req, res, next);
    });
});

productRouter.post('/trade/cancel', authorise(['user']), product.cancelTrade);
productRouter.post('/trade/finalise', authorise(['user']), product.finalizeTrade);
productRouter.get('/create-product', authorise(['user']), product.createProduct);
productRouter.get('/listing-history', authorise(['user']), product.listingHistory);
productRouter.get('/trade/list', authorise(['user']), product.listTrades);

