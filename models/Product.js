const db = require('../utils/db');

class Product {
    
    // 1. Lấy tất cả sản phẩm
    static async getAll() {
        const sql = `
            SELECT p.*, b.name as brand_name, pi.url as image_url 
            FROM products p 
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_main = 1
            ORDER BY p.created_at DESC`;
       
        const [rows] = await db.execute(sql);
        return rows;
    }

    // 2. Lấy theo danh mục
    static async getByCategoryId(categoryId) {
        const sql = `
            SELECT p.*, b.name as brand_name, c.name as category_name, pi.url as image_url
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_main = 1
            WHERE p.category_id = ?
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.execute(sql, [categoryId]);
        return rows;
    }

    // 3. Lấy sản phẩm nổi bật
    static async getFeatured() {
        const sql = `
            SELECT p.*, b.name as brand_name, pi.url as image_url
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_main = 1
            ORDER BY p.created_at DESC 
            LIMIT 8
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    // 4. Lấy chi tiết 1 sản phẩm 
   
    static async getById(id) {
        // A. Lấy thông tin sản phẩm
        const sqlProduct = `
            SELECT p.*, b.name as brand_name, c.name as category_name
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.product_id = ?
        `;
        const [rows] = await db.execute(sqlProduct, [id]);
        let product = rows[0];

        if (!product) return null;

        // B. Lấy toàn bộ danh sách ảnh của sản phẩm này
        const sqlImages = `SELECT * FROM product_images WHERE product_id = ?`;
        const [images] = await db.execute(sqlImages, [id]);
        product.images = images; 

        return product;
    }

    // 5. Lấy danh sách sản phẩm của Seller
    static async getBySellerId(sellerId) {
        const sql = `
            SELECT p.*, b.name as brand_name, pi.url as image_url 
            FROM products p 
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_main = 1
            WHERE p.seller_id = ? 
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.execute(sql, [sellerId]);
        return rows;
    }

    // 6. Thêm sản phẩm mới 
    static async create(data, images) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction(); // Bắt đầu giao dịch

            // A. Thêm thông tin cơ bản
            const sqlProduct = `
                INSERT INTO products (name, price, stock_qty, description, category_id, brand_id, seller_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await connection.execute(sqlProduct, [
                data.name, 
                data.price, 
                data.stock_qty, 
                data.description, 
                data.category_id, 
                data.brand_id, 
                data.seller_id
            ]);
            
            const newProductId = result.insertId;

            // B. Thêm danh sách ảnh (Nếu có)
            if (images && images.length > 0) {
                const sqlImage = `INSERT INTO product_images (product_id, url, is_main) VALUES (?, ?, ?)`;
                for (let img of images) {
                    // img phải có dạng { url: string, isMain: 0 hoặc 1 }
                    await connection.execute(sqlImage, [newProductId, img.url, img.isMain]);
                }
            }

            await connection.commit(); // Lưu thay đổi
            return newProductId;

        } catch (error) {
            await connection.rollback(); // Hoàn tác nếu lỗi
            throw error;
        } finally {
            connection.release(); // Trả kết nối
        }
    }

    // 7. Cập nhật sản phẩm
    static async update(productId, data) {
        // Update bảng products
        const sql = `
            UPDATE products 
            SET name=?, price=?, description=?, stock_qty=?, brand_id=?, category_id=? 
            WHERE product_id=? AND seller_id=?
        `;
        await db.execute(sql, [
            data.name, data.price, data.description, data.stock_qty, 
            data.brand_id, data.category_id, productId, data.seller_id
        ]);

        
        if (data.image_url) {
           
            await db.execute("UPDATE product_images SET is_main = 0 WHERE product_id = ?", [productId]);
            
        
            const sqlImg = `INSERT INTO product_images (product_id, url, is_main) VALUES (?, ?, 1)`;
            await db.execute(sqlImg, [productId, data.image_url]);
        }
    }

    // 8. Xóa sản phẩm
    static async delete(productId, sellerId) {
        const sql = "DELETE FROM products WHERE product_id = ? AND seller_id = ?";
        await db.execute(sql, [productId, sellerId]);
    }
}

module.exports = Product;