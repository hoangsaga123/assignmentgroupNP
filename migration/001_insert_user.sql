-- Insert some sample users with hashed passwords
INSERT INTO users (email, password_hash, fname, lname, phone_number, user_address, user_role)
VALUES 
('john.doe@example.com', 'password', 'John', 'Doe', '0412345678', '123 Elm Street, Sydney', 'user'), -- password: password
('jane.smith@example.com', 'password1', 'Jane', 'Smith', '0423456789', '456 Maple Avenue, Melbourne', 'user'), -- password: password1
('alice.jones@example.com', 'password2', 'Alice', 'Jones', '0434567890', '789 Oak Boulevard, Brisbane', 'user'), -- password: password2
('bob.brown@example.com', 'password3', 'Bob', 'Brown', '0445678901', '101 Pine Street, Perth', 'user'), -- password: password3
('carol.wilson@example.com', 'password4', 'Carol', 'Wilson', '0456789012', '202 Cedar Avenue, Adelaide', 'user'), -- password: password4
('david.miller@example.com', 'password5', 'David', 'Miller', '0467890123', '303 Birch Road, Canberra', 'user'), -- password: password5
('emma.davis@example.com', 'password6', 'Emma', 'Davis', '0478901234', '404 Walnut Street, Hobart', 'user'), -- password: password6
('frank.moore@example.com', 'password7', 'Frank', 'Moore', '0489012345', '505 Chestnut Lane, Darwin', 'user'), -- password: password7
('grace.taylor@example.com', 'password8', 'Grace', 'Taylor', '0490123456', '606 Willow Drive, Newcastle', 'user'), -- password: password8
('henry.anderson@example.com', 'password9', 'Henry', 'Anderson', '0401234567', '707 Poplar Circle, Gold Coast', 'user'); -- password: password9
