USE web_ban_hang;
DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;
INSERT INTO users (user_id, username, password, email, full_name, role, phone, address) VALUES 
(1, 'admin', '123456', 'admin@gmail.com', 'Quản Trị Viên', 'Admin', '0909123456', 'Hà Nội'),
(2, 'shop_trangsuc', '123456', 'seller@gmail.com', 'Cửa Hàng Trang Sức PNJ', 'Seller', '0912345678', 'Đà Nẵng'),
(3, 'khachhang', '123456', 'customer@gmail.com', 'Nguyễn Văn Mua', 'Customer', '0909999888', 'TP.HCM');