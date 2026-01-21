const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');

// Đường dẫn sẽ là: /cart/add/123 (với 123 là ID sản phẩm)
router.get('/add/:id', CartController.add);
// Xem giỏ hàng ---
router.get('/', (req, res) => {
    // Lấy giỏ hàng từ session truyền sang view
    res.render('cart', { cart: req.session.cart || [] });
});
// Route cập nhật
router.get('/update/:id/:quantity', CartController.update);

// Route xóa
router.get('/remove/:id', CartController.remove);

module.exports = router;