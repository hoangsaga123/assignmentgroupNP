import express from 'express';
import debug from 'debug';
import * as server from './config/server.js';
import { cartRouter } from './routes/cart.js';
import { homeRouter } from './routes/home.js';
import { userRouter } from './routes/user.js';
import { productRouter } from './routes/product.js';
import sql from './config/db.js';
import { feedbackRouter, createfeedbackSubmitRouter } from './routes/feedback.js';
import { listingHistory } from './controllers/product.js';

// Setup debug module to spit out all messages
// Do `npn start` to see the debug messages
export const codeTrace = debug('comp3028:server');

// Start the app
export const app = express();
server.setup(app)

// Register any middleware here

// Register routers here
app.use('/', homeRouter);
app.use('/', cartRouter);
app.use('/', userRouter);
app.use('/', productRouter);
app.use('/', feedbackRouter);
app.use('/', createfeedbackSubmitRouter);




// Function to safely shutdown the server
function shutdown() {
  console.log('Shutting down the server...');
  sql.end() // Closing the DB connection pool
    .then(() => {
      console.log('Database connection closed.');
      process.exit(0); // Exiting the process
    })
    .catch((err) => {
      console.error('Error while closing database connection:', err);
      process.exit(1); // Exiting with error
    });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown); // Handling Ctrl+C

// Not encouraged, but this is a simple example of how to register a route without a router.
app.get('/test', (req, res) => {
  res.send('Test');
});

app.get('/api/v1/products', async (req, res) => {
  try {
    let result = await sql`SELECT product_name FROM products`;
    // let products = [];
    // for (let item of result) {
    //   products.push(item.priduct_name);
    // }
    const productNames = result.map(item => item.product_name);
    res.json(productNames);
  } catch (error) {
    console.error(`Failed to connect to the DB: ${error}`);
    res.status(500).send('Internal Server Error');
  }
})


// ####################################### No need to modify below this line #######################################
// Start the server
server.errorHandling(app);

export const runningServer = app.listen(server.port, () => {
  console.log(`Example app listening on port http://127.0.0.1:${server.port}`);
  debug('testing');
});
