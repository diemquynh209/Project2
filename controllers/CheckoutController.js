const db = require('../utils/db'); 

const CheckoutController = {
    // 1. Hiện trang điền thông tin (GET)
    pageCheckout: (req, res) => {
        if (!req.session.username) {
            return res.redirect('/login');
        }

        if (!req.session.cart || req.session.cart.length === 0) {
            return res.redirect('/');
        }

        let cart = req.session.cart;
        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Truyền thêm biến user để view hiển thị tên người nhận
        // Ưu tiên hiển thị Họ tên đầy đủ, nếu không có thì hiện username
        let userDisplay = req.session.full_name || req.session.username;

        res.render('checkout', { 
            cart: cart, 
            total: total,
            user: userDisplay 
        });
    },

    // 2. Xử lý lưu đơn hàng (POST)
    submitOrder: async (req, res) => {
        try {
            if (!req.session.userId) {
                return res.redirect('/login');
            }

            let userId = req.session.userId;
            let cart = req.session.cart;
            
            // Lấy thêm address từ form (khách có thể nhập địa chỉ khác lúc checkout)
            let { address, payment_method } = req.body;
            let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // B. Lưu vào bảng ORDERS
            const sqlOrder = `INSERT INTO orders (user_id, shipping_address, payment_method, final_total, status) VALUES (?, ?, ?, ?, 'Pending')`;
            const [result] = await db.execute(sqlOrder, [userId, address, payment_method, total]);
            
            let newOrderId = result.insertId; 

            // C. Lưu vào bảng ORDER_DETAILS
            for (let item of cart) {
                const sqlDetail = `INSERT INTO order_details (order_id, product_id, quantity, final_total) VALUES (?, ?, ?, ?)`;
                let lineTotal = item.price * item.quantity;
                await db.execute(sqlDetail, [newOrderId, item.product_id, item.quantity, lineTotal]);
            }

            // D. Xóa giỏ hàng
            req.session.cart = []; 
            res.render('success', { orderId: newOrderId });

        } catch (err) {
            console.log(err);
            res.send("Lỗi đặt hàng: " + err.message);
        }
    }
};

module.exports = CheckoutController;