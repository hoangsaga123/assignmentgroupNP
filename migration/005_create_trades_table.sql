-- Note that if you don't have a insert value sql file here
-- Then all of you data from outside this folder will be deleted because of the line below
DROP TABLE IF EXISTS trades;
CREATE TABLE trades (

    -- Primary key declared
    -- SERIAL is being used to auto-increment id
    trade_id SERIAL PRIMARY KEY,
    trade_status VARCHAR(10) NOT NULL DEFAULT 'onhold', -- Status of the trade (onhold, cancelled, completed)
    trade_accepted BOOLEAN NOT NULL DEFAULT FALSE, -- to check if the other user accept the trade
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    

    -- FOREING KEY
    starter_product_id INT NOT NULL, -- Reference to the first product in the trade
    responder_product_id INT NOT NULL, -- Reference to the second product in the trade

    -- Foreign keys linking to the products table
    CONSTRAINT fk_product_starter
        FOREIGN KEY (starter_product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_product_responder
        FOREIGN KEY (responder_product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    -- Add constraint to ensure valid status values
    CONSTRAINT chk_trade_status CHECK (trade_status IN ('onhold', 'cancelled', 'completed'))
);