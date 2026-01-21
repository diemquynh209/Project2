USE web_ban_hang;
DELETE FROM brands;
ALTER TABLE brands AUTO_INCREMENT = 1;

INSERT INTO brands (brand_id, name) VALUES 
(1, 'Pandora'), 
(2, 'SJC'), 
(3, 'No Brand'),
(4, 'Bảo Tín Minh Châu'),
(5, 'PNJ');