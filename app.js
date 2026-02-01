const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

// Import Controllers
const ProductController = require('./controllers/ProductController');
const AuthController = require('./controllers/AuthController');
const checkoutRoutes = require('./routes/checkout');
const sellerRouter = require('./routes/seller');


// Import Routes
const cartRoutes = require('./routes/cart');


// Cấu hình View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//  Cấu hình đọc dữ liệu Form
app.use(express.urlencoded({ extended: true }));

// Cấu hình thư mục Public (CSS, Ảnh)
app.use(express.static(path.join(__dirname, 'public')));

//  Cấu hình Session 
app.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: true, // Nên để true để tạo session ngay khi khách vào
    cookie: { secure: false } // false vì đang chạy localhost
}));

//  Middleware truyền biến xuống view (Chạy sau Session)
app.use((req, res, next) => {
    // Lưu thông tin user
    res.locals.user = req.session.user;
    // Lưu thông tin giỏ hàng (Để hiển thị số lượng trên menu)
    res.locals.cart = req.session.cart || [];
    next();
});

// ĐỊNH TUYẾN (ROUTES)  ---
app.use('/seller', sellerRouter);

// Route Giỏ hàng 
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);

// Route Sản phẩm & Trang chủ
app.get('/category/:id', ProductController.getCategory);
app.get('/', ProductController.index);

// Route Xác thực
app.get('/login', AuthController.getLogin);
app.post('/login', AuthController.postLogin);
app.get('/register', AuthController.getRegister);
app.post('/register', AuthController.postRegister);
app.get('/logout', AuthController.logout);

// Chạy Server
app.listen(3000, () => {
    console.log('Server đang chạy tại: http://localhost:3000');
});