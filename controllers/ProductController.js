const Product = require('../models/Product');

const ProductController = {
    // 1. Trang chủ:
    // File: controllers/ProductController.js

    index: async (req, res) => {
        try {
            // 1. Lấy dữ liệu từ Model
            const allProducts = await Product.getAll();

            // 2. IN RA MÀN HÌNH TERMINAL ĐỂ KIỂM TRA (DEBUG)
            
            if (allProducts.length > 0) {
            } else {
            }

            const featuredProducts = allProducts.slice(0, 8);

            res.render('home', {
                products: featuredProducts,
                user: req.session.user, // Truyền thêm user để header không lỗi
                cart: req.session.cart || []
            });
        } catch (err) {
            // In lỗi chi tiết ra Terminal nếu có
            console.error("!!! LỖI NGHIÊM TRỌNG !!!");
            console.error(err);
            res.send("Lỗi tải dữ liệu: " + err.message);
        }
    },

    // 2. Trang danh sách sản phẩm theo danh mục
    getCategory: async (req, res) => {
        try {
            const categoryId = req.params.id; // Lấy ID từ đường dẫn
            const allProducts = await Product.getAll();

            // Lọc sản phẩm theo category_id
            const products = allProducts.filter(p => p.category_id == categoryId);

            // Đặt tên tiêu đề
            let categoryName = "Sản phẩm";
            if (categoryId == 1) categoryName = "Bộ Sưu Tập Vòng Tay";
            if (categoryId == 2) categoryName = "Các Mẫu Dây Chuyền";
            if (categoryId == 3) categoryName = "Nhẫn Cao Cấp";

            res.render('products', {
                products: products,
                title: categoryName
            });
        } catch (err) {
            console.log(err);
            res.send("Lỗi tải dữ liệu");
        }
    },

    // 3. (MỚI) Trang chi tiết sản phẩm
    detail: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await Product.getById(productId);

            if (!product) return res.redirect('/');

            res.render('detail', { product: product });
        } catch (err) {
            console.log(err);
            res.send("Lỗi tải chi tiết sản phẩm");
        }
    }
};

module.exports = ProductController;