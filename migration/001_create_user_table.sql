CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(100) NOT NULL UNIQUE PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    fname VARCHAR(30) NOT NULL,
    lname VARCHAR(30) NOT NULL,
    phone_number VARCHAR(11) NOT NULL UNIQUE,
    user_address VARCHAR(100) NOT NULL,
    user_role VARCHAR(10) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);