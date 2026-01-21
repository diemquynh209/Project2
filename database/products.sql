USE web_ban_hang;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. CHÈN SẢN PHẨM 
INSERT INTO products (product_id, name, price, category_id, brand_id, description, seller_id, stock_qty) VALUES 
(1, 'Vòng Pandora Moments', 2513000, 1, 1, 'Dây Gai Khóa Trái Tim. Chất liệu: Bạc 925. Xuất xứ: Thái Lan.', 2, 50),
(2, 'Dây chuyền bạc đá sapphire', 2200000, 2, 3, 'Phong cách hiện đại. Chất liệu: Bạc cao cấp đính đá Sapphire.', 2, 50),
(3, 'Nhẫn hoa tuyết đá xanh', 15000000, 3, 2, 'Mặt đá TOPAZ CZ. Chất liệu: Vàng trắng 14K.', 2, 20),
(4, 'Vòng tay Bạc đính đá', 2555000, 1, 5, 'Chế tác thủ công tỉ mỉ. Chất liệu: Bạc 925. Thương hiệu: PNJ.', 2, 50),
(5, 'Nhẫn bạc 999', 1500000, 3, 3, 'Nhẫn trơn đơn giản tinh tế. Chất liệu: Bạc 999 nguyên chất.', 2, 100),
(6, 'Dây chuyền vàng cưới', 12000000, 2, 4, 'Quà tặng ý nghĩa ngày trọng đại. Chất liệu: Vàng 24K (1 chỉ).', 2, 10),
(7, 'Dây chuyền bạc mặt trái tim', 3400000, 2, 1, 'Biểu tượng tình yêu vĩnh cửu. Chất liệu: Bạc Sterling.', 2, 40),
(8, 'Vòng tay bạc trạm thủ công', 7555000, 1, 5, 'Trạm khắc tinh xảo bởi nghệ nhân. Chất liệu: Bạc 999.', 2, 15);

-- 2. CHÈN ẢNH 
INSERT INTO product_images (product_id, url, is_main, alt_text) VALUES 
(1, '/images/vongtaypan1.jpg', 1, 'Vòng Pandora Moments'),
(2, '/images/day-chuyen.jpg', 1, 'Dây chuyền đá Sapphire'),
(3, '/images/nhansjc1.jpg', 1, 'Nhẫn hoa tuyết đá xanh'),
(4, '/images/vongtaypnj1.jpg', 1, 'Vòng tay PNJ đính đá'),
(5, '/images/nhan.jpg', 1, 'Nhẫn bạc trơn 999'),
(6, '/images/daychuyenbtmc.jpg', 1, 'Dây chuyền vàng cưới BTMC'),
(7, '/images/daychuyenpan1.jpg', 1, 'Dây chuyền trái tim Pandora'),
(8, '/images/vong-tay.jpg', 1, 'Vòng tay trạm khắc thủ công');