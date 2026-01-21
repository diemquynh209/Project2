USE web_ban_hang;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Bảng Giỏ hàng
DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 2. Bảng Chi tiết giỏ hàng
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    current_price DECIMAL(15, 2),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;