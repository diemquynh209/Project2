const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/CheckoutController');

// Hiện trang điền thông tin
router.get('/', CheckoutController.pageCheckout);

// Xử lý khi bấm nút "Xác nhận đặt hàng"
router.post('/submit', CheckoutController.submitOrder);

module.exports = router;