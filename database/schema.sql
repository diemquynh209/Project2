USE web_ban_hang;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    phone VARCHAR(15),           
    address TEXT,                
    role VARCHAR(20) DEFAULT 'Customer',
    status VARCHAR(20) DEFAULT 'Active'
);

-- 2. Sessions
DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT,
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiry_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Brands
DROP TABLE IF EXISTS brands;
CREATE TABLE brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- 4. Categories
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 5. Products 
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT,                 
    name VARCHAR(200) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    stock_qty INT DEFAULT 0,
    description TEXT, 
    brand_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

-- 6. Product Images
DROP TABLE IF EXISTS product_images;
CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,   
    alt_text VARCHAR(100),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;