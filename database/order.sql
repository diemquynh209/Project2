USE web_ban_hang;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Bảng Đơn hàng
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    shipping_address TEXT,
    payment_method VARCHAR(50),
    final_total DECIMAL(15, 2),
    status VARCHAR(20) DEFAULT 'Pending', -- Pending, Shipping, Completed...
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 2. Bảng Chi tiết đơn hàng
DROP TABLE IF EXISTS order_details;
CREATE TABLE order_details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    final_total DECIMAL(15, 2), -- Giá chốt tại thời điểm mua
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

SET FOREIGN_KEY_CHECKS = 1;