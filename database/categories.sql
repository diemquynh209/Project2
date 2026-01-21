USE web_ban_hang;
DELETE FROM categories;
ALTER TABLE categories AUTO_INCREMENT = 1;

INSERT INTO categories (category_id, name, description) VALUES 
(1, 'Vòng tay', 'Các mẫu vòng tay, lắc tay thời thượng'), 
(2, 'Dây chuyền', 'Dây chuyền vàng, bạc, kim cương'), 
(3, 'Nhẫn', 'Nhẫn đôi, nhẫn cưới, nhẫn kiểu');