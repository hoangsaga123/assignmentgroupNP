DROP TABLE IF EXISTS products;
CREATE TABLE products (

    -- Primary key declared
    -- SERIAL is being used to auto-increment id
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL, -- product name
    price NUMERIC(10, 2) NOT NULL, -- price
    description TEXT, -- description use text for no restriction on length
    status VARCHAR(10) NOT NULL, -- define the status of the product either new or used
    flag VARCHAR(10) DEFAULT ('SELL'), -- flag to track order status

    -- This will auto create the time of created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- This will auto create the time when the table is being updated
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- This will keep the image url or path of the product
    image_path VARCHAR(255) DEFAULT '/img/default.jpg',

    -- FOREIGN KEY
    category_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    cart_user_email VARCHAR(100) DEFAULT NULL,
    buy_user_email VARCHAR(100) DEFAULT NULL,

    -- Add constraint and check for status and flag
    CONSTRAINT chk_status CHECK (status IN ('new', 'used')),
    CONSTRAINT chk_flag CHECK (flag IN ('SELL', 'BUY', 'CART', 
    'TRADE')),

    -- Foreign key assigned for category and order
    CONSTRAINT fk_user_email
        FOREIGN KEY (user_email)
            REFERENCES users(email)
            ON DELETE CASCADE,
    CONSTRAINT fk_category 
        FOREIGN KEY (category_name) 
            REFERENCES categories(category_name),
    CONSTRAINT fk_cart_user_email
        FOREIGN KEY (cart_user_email)
            REFERENCES users(email)
            ON DELETE CASCADE,
    CONSTRAINT fk_buy_user_email
        FOREIGN KEY (buy_user_email)
            REFERENCES users(email)
            ON DELETE CASCADE
);
