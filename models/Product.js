const db = require('../utils/db');

class Product {
    
    // Lấy tất cả sản phẩm 
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

    // Lấy theo danh mục
    static async getByCategoryId(categoryId) {
        const sql = `
            SELECT p.*, b.name as brand_name, c.name as category_name, pi.url as image_url
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_main = 1
            WHERE p.category_id = ?
            GROUP BY p.product_id
        `;
        const [rows] = await db.execute(sql, [categoryId]);
        return rows;
    }

    // Lấy nổi bật
    static async getFeatured() {
        const sql = `
            SELECT p.*, b.name as brand_name, pi.url as image_url
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_main = 1
            GROUP BY p.product_id
            ORDER BY p.created_at DESC 
            LIMIT 8
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    // Lấy chi tiết 1 sản phẩm
    static async getById(id) {
        // 1. Lấy thông tin sản phẩm
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

        // 2. Lấy danh sách ảnh
        const sqlImages = `SELECT * FROM product_images WHERE product_id = ?`;
        const [images] = await db.execute(sqlImages, [id]);
        product.images = images;

        return product;
    }

    // Thêm sản phẩm (Đã bỏ specifications)
    static async create(data, images) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

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

            if (images && images.length > 0) {
                const sqlImage = `INSERT INTO product_images (product_id, url, is_main) VALUES (?, ?, ?)`;
                for (let img of images) {
                    await connection.execute(sqlImage, [newProductId, img.url, img.isMain]);
                }
            }

            await connection.commit();
            return newProductId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    // 1. Lấy danh sách sản phẩm của một Seller cụ thể
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

    // 2. Lấy chi tiết 1 sản phẩm để Sửa (Edit)
    static async findById(id) {
        const sql = `
            SELECT p.*, pi.url as image_url 
            FROM products p 
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_main = 1
            WHERE p.product_id = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    // 3. Thêm sản phẩm mới (Xử lý 2 bảng: products và product_images)
    static async create(data) {
        // A. Thêm vào bảng products
        const sqlProduct = `
            INSERT INTO products (seller_id, name, price, description, brand_id, category_id, stock_qty) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sqlProduct, [
            data.seller_id, data.name, data.price, data.description, 
            data.brand_id, data.category_id, data.stock_qty
        ]);
        
        const newProductId = result.insertId;

        // B. Thêm vào bảng product_images (Lấy ảnh chính)
        if (data.image_url) {
            const sqlImage = `INSERT INTO product_images (product_id, url, is_main) VALUES (?, ?, 1)`;
            await db.execute(sqlImage, [newProductId, data.image_url]);
        }
        
        return newProductId;
    }

    // 4. Cập nhật sản phẩm
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

        // Update ảnh (Cách đơn giản: Update link ảnh chính cũ)
        if (data.image_url) {
            const sqlImg = `UPDATE product_images SET url=? WHERE product_id=? AND is_main=1`;
            await db.execute(sqlImg, [data.image_url, productId]);
        }
    }

    // 5. Xóa sản phẩm
    static async delete(productId, sellerId) {
        // Phải đảm bảo đúng seller mới được xóa
        const sql = "DELETE FROM products WHERE product_id = ? AND seller_id = ?";
        await db.execute(sql, [productId, sellerId]);
    }
}

module.exports = Product;