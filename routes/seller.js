const express = require('express');
const router = express.Router();
const SellerController = require('../controllers/SellerController');

// Middleware chặn: Chỉ cho Seller vào
const requireSeller = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Seller') {
        next();
    } else {
        res.send("Bạn không có quyền truy cập trang này!");
    }
};

router.use(requireSeller); // Áp dụng bảo vệ cho tất cả link bên dưới

router.get('/dashboard', SellerController.getDashboard);

router.get('/add', SellerController.getAddProduct);
router.post('/add', SellerController.postAddProduct);

router.get('/edit/:id', SellerController.getEditProduct);
router.post('/edit/:id', SellerController.postEditProduct);

router.get('/delete/:id', SellerController.deleteProduct);

module.exports = router;