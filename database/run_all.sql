/* File: run_all.sql - PHIÊN BẢN CHUẨN (Fix lỗi hỏng bảng Users) */

-- 1. XÓA DATABASE CŨ (Để sửa lỗi bảng bị hỏng/crash)
DROP DATABASE IF EXISTS web_ban_hang;

-- 2. TẠO DATABASE MỚI
CREATE DATABASE web_ban_hang;
USE web_ban_hang;

-- Tắt kiểm tra khóa ngoại tạm thời để tạo bảng không bị lỗi thứ tự
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================
-- PHẦN 1: TẠO CẤU TRÚC BẢNG (STRUCTURE)
-- ====================================================

-- 1.1. Bảng Users
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

-- 1.2. Bảng Sessions
CREATE TABLE sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT,
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiry_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 1.3. Bảng Brands
CREATE TABLE brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- 1.4. Bảng Categories
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 1.5. Bảng Products (Có description, KHÔNG CÓ specifications)
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT,                 
    name VARCHAR(200) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    stock_qty INT DEFAULT 0,
    description TEXT,       
    category_id INT,
    brand_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

-- 1.6. Bảng Product Images
CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,   
    alt_text VARCHAR(100),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 1.7. Bảng Cart & Cart Items
CREATE TABLE cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    current_price DECIMAL(15, 2),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 1.8. Bảng Orders & Order Details
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    shipping_address TEXT,
    payment_method VARCHAR(50),
    final_total DECIMAL(15, 2),
    status VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    final_total DECIMAL(15, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 1.9. Bảng Reviews
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Shown',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ====================================================
-- PHẦN 2: NẠP DỮ LIỆU MẪU (DATA)
-- ====================================================

-- 2.1. Nạp Users
INSERT INTO users (user_id, username, password, email, full_name, role, phone, address) VALUES 
(1, 'admin', '123456', 'admin@gmail.com', 'Quản Trị Viên', 'Admin', '0909123456', 'Hà Nội'),
(2, 'shop_trangsuc', '123456', 'seller@gmail.com', 'Cửa Hàng Trang Sức PNJ', 'Seller', '0912345678', 'Đà Nẵng'),
(3, 'khachhang', '123456', 'customer@gmail.com', 'Nguyễn Văn Mua', 'Customer', '0909999888', 'TP.HCM');

-- 2.2. Nạp Brands
INSERT INTO brands (brand_id, name) VALUES 
(1, 'Pandora'), (2, 'SJC'), (3, 'No Brand'), (4, 'Bảo Tín Minh Châu'), (5, 'PNJ');

-- 2.3. Nạp Categories
INSERT INTO categories (category_id, name, description) VALUES 
(1, 'Vòng tay', 'Các mẫu vòng tay thời thượng'), 
(2, 'Dây chuyền', 'Dây chuyền vàng, bạc'), 
(3, 'Nhẫn', 'Nhẫn đôi, nhẫn cưới');

-- 2.4. Nạp Products
INSERT INTO products (product_id, name, price, category_id, brand_id, description, seller_id, stock_qty) VALUES 
(1, 'Vòng Pandora Moments', 2513000, 1, 1, 'Dây Gai Khóa Trái Tim. Chất liệu: Bạc 925. Xuất xứ: Thái Lan.', 2, 50),
(2, 'Dây chuyền bạc đá sapphire', 2200000, 2, 3, 'Phong cách hiện đại. Chất liệu: Bạc cao cấp đính đá Sapphire.', 2, 50),
(3, 'Nhẫn hoa tuyết đá xanh', 15000000, 3, 2, 'Mặt đá TOPAZ CZ. Chất liệu: Vàng trắng 14K.', 2, 20),
(4, 'Vòng tay Bạc đính đá', 2555000, 1, 5, 'Chế tác thủ công tỉ mỉ. Chất liệu: Bạc 925. Thương hiệu: PNJ.', 2, 50),
(5, 'Nhẫn bạc 999', 1500000, 3, 3, 'Nhẫn trơn đơn giản tinh tế. Chất liệu: Bạc 999 nguyên chất.', 2, 100),
(6, 'Dây chuyền vàng cưới', 12000000, 2, 4, 'Quà tặng ý nghĩa ngày trọng đại. Chất liệu: Vàng 24K (1 chỉ).', 2, 10),
(7, 'Dây chuyền bạc mặt trái tim', 3400000, 2, 1, 'Biểu tượng tình yêu vĩnh cửu. Chất liệu: Bạc Sterling.', 2, 40),
(8, 'Vòng tay bạc trạm thủ công', 7555000, 1, 5, 'Trạm khắc tinh xảo bởi nghệ nhân. Chất liệu: Bạc 999.', 2, 15);

-- 2.5. Nạp Product Images
INSERT INTO product_images (product_id, url, is_main, alt_text) VALUES 
(1, '/images/vongtaypan1.jpg', 1, 'Vòng Pandora Moments'),
(2, '/images/day-chuyen.jpg', 1, 'Dây chuyền đá Sapphire'),
(3, '/images/nhansjc1.jpg', 1, 'Nhẫn hoa tuyết đá xanh'),
(4, '/images/vongtaypnj1.jpg', 1, 'Vòng tay PNJ đính đá'),
(5, '/images/nhan.jpg', 1, 'Nhẫn bạc trơn 999'),
(6, '/images/daychuyenbtmc.jpg', 1, 'Dây chuyền vàng cưới BTMC'),
(7, '/images/daychuyenpan1.jpg', 1, 'Dây chuyền trái tim Pandora'),
(8, '/images/vong-tay.jpg', 1, 'Vòng tay trạm khắc thủ công');

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- Thông báo
SELECT 'RESET DATABASE THÀNH CÔNG - SẴN SÀNG CHẠY APP!' AS Thong_Bao;