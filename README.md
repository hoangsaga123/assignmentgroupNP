# SDD_Project_Group_Assessment

## SDD Task List Distribution
- Minh Hoang NGUYEN - 22023230: Product and Trade Management
- Phuong Nguyen - 22102700: Search and Discovery, Feedback and Rating
- Thanh Khiet HUYNH - 20650982: User Management
- Fanke Qin - 19923257: Shopping Cart and Order Management

## Essential Modules and Installing Commands
- Express: For creating and handling server
  'npm install express'
- nodemon: For monitoring change during server is on fly
  'npm install -g nodemon'
- Debug: (Optional) For debugging
  'npm install debug'
- EJS: For template
  'npm install ejs'
- Express: For creating and handling server-side applications and APIs.
  Install command: 'npm install express'
- Nodemon: For monitoring changes during server execution and automatically restarting the server.
  'npm install -g nodemon'
- Debug (Optional): For debugging purposes during development.
  'npm install debug'
- EJS: Templating language for embedding JavaScript into HTML to create dynamic views.
  'npm install ejs'
- bcrypt: For hashing passwords securely and comparing them for authentication.
  'npm install bcrypt'
- Bootstrap: A frontend framework for designing responsive web applications.
  'npm install bootstrap'
- cookie-parser: Middleware that parses cookies attached to client requests.
  'npm install cookie-parser'
- dotenv: For managing environment variables.
  'npm install dotenv'
- express-session: For managing user sessions in web applications.
  'npm install express-session'
- http-errors: For creating HTTP error objects with standard status codes.
  'npm install http-errors'
- jsdom: JavaScript implementation of the DOM for server-side HTML manipulation and testing.
  'npm install jsdom'
- jsonwebtoken: For creating and verifying JSON Web Tokens (JWT) for secure authentication.
  'npm install jsonwebtoken'
- mocha: Testing framework for writing unit and integration tests.
  'npm install mocha'
- morgan: HTTP request logger middleware for logging requests and responses in Express.
  'npm install morgan'
- multer: Middleware for handling file uploads (e.g., multipart forms).
  'npm install multer'
- postgres: PostgreSQL client for interacting with the database.
  'npm install postgres'
- dotnev: add a new file in root file called '.env'
  'npm install dotenv'
- put follow line into .env file (please make sure the .env is in the root file):  
  SESSION_SECRET=comp3028
  JWT_SECRET=comp3028-token
  NODE_ENV=development
  SALT_ROUNDS=1000
- Json Web Tokens: 
  'npm install jsonwebtoken'
  
## SDD Database Design:
User:
- email (PK)
- password_hash
- fname
- lname
- phone_number
- user_address
- user_role

Product:
- product_id (PK)
- product_name
- price
- description
- status
- flag
- image_path
- category_name (FK)
- user_email (FK)

Category:
- category_name (PK)
- description

Trade:
- trade_id (PK)
- trade_status
- trade_accepted
- created_at
- starter_product_id (FK)
- responder_product_id (FK)

## Required Module:
- bcrypt - Used to hash passwords securely and compare them with stored hashes for authentication purposes.
- bootstrap - A popular frontend framework used for designing responsive web applications.
- cookie-parser - Middleware that parses cookies attached to client requests, making them accessible via req.cookies.
- debug - A small utility for logging debug messages in Node.js applications during development.
- dotenv - Loads environment variables from a .env file into process.env for configuration management.
- ejs - Templating language that allows embedding JavaScript into HTML to create dynamic pages.
- express - Web application framework for Node.js, used for building server-side applications and APIs.
- express-session - Middleware for managing user sessions and persisting session data between requests.
- http-errors - Provides a utility for creating HTTP error objects with standard status codes.
- jsdom - A JavaScript implementation of the DOM for server-side manipulation of HTML and integration testing.
- jsonwebtoken - Used to create, sign, and verify JSON Web Tokens (JWT) for secure authentication and authorization.
- mocha - A testing framework for Node.js that allows writing unit, integration, and functional tests.
- morgan - HTTP request logger middleware for Express, useful for logging requests and responses.
- multer - Middleware for handling file uploads, specifically for handling multipart/form-data in Express.
- postgres - Node.js library to interface with PostgreSQL databases, supports query building and connection pooling.

## File Organisation:
root
- config
- controllers
- middleware
- migration
- node_modules (ignores)
- public
  - img
    - example-image
    - ui
    - users
  - js
  - stylesheets
- routes
- services
- test
- utility
- views
  - partials
- app.js (run file)

## How to start the website:

1. Type in the terminal 'npm update' then 'npm install' or manually update each dependencies if you encount any npm install error
2. Type in the terminal 'node config/migrationRunner.js migrate' to setup the database (if you already have setup some database please type 'node config/migrationRunner.js destroy' then the latter)
3. Type in the terminal 'node app.js' to start the server
4. Please click on the url in the terminal to follow the browser to the site
5. Register and login to access the whole functionality of the website 
