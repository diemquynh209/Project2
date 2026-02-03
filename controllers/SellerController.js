const Product = require('../models/Product');

const SellerController = {
    // 1. Hiển thị Dashboard
    getDashboard: async (req, res) => {
        try {
            const sellerId = req.session.user.user_id; 
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
            // Chuẩn bị dữ liệu từ form
            const data = {
                seller_id: req.session.user.user_id,
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                stock_qty: req.body.stock_qty,
                brand_id: req.body.brand_id,
                category_id: req.body.category_id,
                image_url: req.body.image_url 
            };
            
            // Tạo mảng hình ảnh cho hàm create mới
            const images = [];
            if (data.image_url) {
                images.push({ url: data.image_url, isMain: 1 });
            }

            // Gọi hàm create (truyền đủ 2 tham số: data và images)
            await Product.create(data, images);
            
            res.redirect('/seller/dashboard');
        } catch (err) {
            console.log(err);
            res.send("Lỗi thêm sản phẩm");
        }
    },

    // 4. Hiển thị form Sửa 
    getEditProduct: async (req, res) => {
        try {
            
            const product = await Product.getById(req.params.id);
            
            if (!product) {
                return res.redirect('/seller/dashboard');
            }
            
            if (product.images && product.images.length > 0) {
        
                const mainImage = product.images.find(img => img.is_main == 1) || product.images[0];
                product.image_url = mainImage.url;
            } else {
                product.image_url = "";
            }

            // Kiểm tra quyền sở hữu (Security)
            if (product.seller_id !== req.session.user.user_id) {
                return res.send("Bạn không có quyền sửa sản phẩm này");
            }

            res.render('seller/edit-product', { product });

        } catch (err) {
            console.log(err); // Log lỗi ra terminal 
            res.send("Lỗi tải form sửa");
        }
    },

    // 5. Xử lý Sửa
    postEditProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            const data = {
                seller_id: req.session.user.user_id,
                ...req.body 
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
            console.log(err);
            res.send("Lỗi xóa sản phẩm");
        }
    }
};

module.exports = SellerController;