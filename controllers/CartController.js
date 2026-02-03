const Product = require('../models/Product');

const CartController = {
    // Chức năng: Thêm sản phẩm vào giỏ
    add: async (req, res) => {
        try {
            const productId = req.params.id; 
            const product = await Product.getById(productId); 

            // Nếu không tìm thấy sản phẩm thì về trang chủ
            if (!product) {
                return res.redirect('/'); 
            }

            // Xử lý lấy ảnh đại diện 
            let mainImage = '/images/no-image.jpg';
            if (product.images && product.images.length > 0) {
                // Tìm ảnh được đánh dấu là main, nếu không có lấy ảnh đầu tiên
                let imgObj = product.images.find(img => img.is_main) || product.images[0];
                mainImage = imgObj.image_url || imgObj.url;
            }

            // 1. Lấy giỏ hàng từ Session (nếu chưa có thì tạo mảng rỗng)
            let cart = req.session.cart || [];

            // 2. Kiểm tra xem sản phẩm này đã có trong giỏ chưa
            const existingItem = cart.find(item => item.product_id == productId);

            if (existingItem) {
                // Nếu có rồi thì tăng số lượng
                existingItem.quantity += 1;
            } else {
                // Nếu chưa có thì thêm mới vào
                cart.push({
                    product_id: product.product_id,
                    name: product.name,
                    price: product.price,
                    image_url: mainImage, 
                    quantity: 1
                });
            }

            // 3. Lưu ngược lại vào Session
            req.session.cart = cart;

            // 4. Quay lại trang cũ
            const returnUrl = req.get('Referer') || '/';
            res.redirect(returnUrl);

        } catch (err) {
            console.error(err);
            res.send("Lỗi xử lý giỏ hàng: " + err.message);
        }
    },

    // CẬP NHẬT SỐ LƯỢNG
    update: (req, res) => {
        const productId = req.params.id;
        const newQuantity = parseInt(req.params.quantity); 

        let cart = req.session.cart || [];
        
        let item = cart.find(product => product.product_id == productId);
        
        if (item) {
            if (newQuantity > 0) {
                item.quantity = newQuantity;
            } else {
                // Nếu số lượng <= 0 thì xóa
                cart = cart.filter(product => product.product_id != productId);
            }
        }

        req.session.cart = cart; 
        res.redirect('/cart');   
    },
    
    // Xóa sản phẩm
    remove: (req, res) => {
        const productId = req.params.id;
        let cart = req.session.cart || [];
        req.session.cart = cart.filter(product => product.product_id != productId);
        res.redirect('/cart');
    }
};

module.exports = CartController;