CREATE TABLE IF NOT EXISTS feedback (
    feedback_id SERIAL PRIMARY KEY, -- Alternatively: feedback_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
    feedback_headline VARCHAR(100) NOT NULL,
    feedback_description TEXT,
    rating_condition VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- This will keep the image url or path of the feedback
    image_path VARCHAR(255) NULL,

    -- Foreign keys
    email VARCHAR(100) NOT NULL,
    product_id INT,

    -- Add constraint and check for rating_condition 
    CONSTRAINT rating_condition_check CHECK (rating_condition IN ('Very Good', 'Good','OK','Bad','Very Bad')),

    -- Foreign key constraints
    CONSTRAINT fk_user_email
        FOREIGN KEY (email)
            REFERENCES users(email)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_product_id
        FOREIGN KEY (product_id)
            REFERENCES products(product_id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
);