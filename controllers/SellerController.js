const Product = require('../models/Product');

const SellerController = {
    // 1. Hiển thị Dashboard (Danh sách sản phẩm của Seller)
    getDashboard: async (req, res) => {
        try {
            const sellerId = req.session.user.user_id; // Lấy ID từ session
            const products = await Product.getBySellerId(sellerId);
            res.render('seller/dashboard', { products });
        } catch (err) {
            console.log(err);
            res.send("Lỗi hệ thống");
        }
    },

    // 2. Hiển thị form Thêm mới
    getAddProduct: (req, res) => {
        res.render('seller/add-product');
    },

    // 3. Xử lý Thêm mới
    postAddProduct: async (req, res) => {
        try {
            const data = {
                seller_id: req.session.user.user_id,
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                stock_qty: req.body.stock_qty,
                brand_id: req.body.brand_id,
                category_id: req.body.category_id,
                image_url: req.body.image_url // Link ảnh online
            };
            await Product.create(data);
            res.redirect('/seller/dashboard');
        } catch (err) {
            console.log(err);
            res.send("Lỗi thêm sản phẩm");
        }
    },

    // 4. Hiển thị form Sửa
    getEditProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            // Kiểm tra xem sản phẩm có thuộc về seller này không
            res.render('seller/edit-product', { product });
        } catch (err) {
            res.send("Lỗi tải form sửa");
        }
    },

    // 5. Xử lý Sửa
    postEditProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            const data = {
                seller_id: req.session.user.user_id,
                ...req.body // Lấy hết dữ liệu từ form
            };
            await Product.update(productId, data);
            res.redirect('/seller/dashboard');
        } catch (err) {
            console.log(err);
            res.send("Lỗi cập nhật");
        }
    },

    // 6. Xóa sản phẩm
    deleteProduct: async (req, res) => {
        try {
            const sellerId = req.session.user.user_id;
            await Product.delete(req.params.id, sellerId);
            res.redirect('/seller/dashboard');
        } catch (err) {
            res.send("Lỗi xóa sản phẩm");
        }
    }
};

module.exports = SellerController;