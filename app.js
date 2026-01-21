const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

// Import Controllers
const ProductController = require('./controllers/ProductController');
const AuthController = require('./controllers/AuthController');
const checkoutRoutes = require('./routes/checkout');

// Import Routes
const cartRoutes = require('./routes/cart');

// 1. Cấu hình View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Cấu hình đọc dữ liệu Form
app.use(express.urlencoded({ extended: true }));

// 3. Cấu hình thư mục Public (CSS, Ảnh)
app.use(express.static(path.join(__dirname, 'public')));

// 4. Cấu hình Session (QUAN TRỌNG: PHẢI ĐẶT TRƯỚC CÁC ROUTE)
app.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: true, // Nên để true để tạo session ngay khi khách vào
    cookie: { secure: false } // false vì đang chạy localhost
}));

// 5. Middleware truyền biến xuống view (Chạy sau Session)
app.use((req, res, next) => {
    // Lưu thông tin user
    res.locals.user = req.session.username || null;
    res.locals.role = req.session.role || null;
    
    // Lưu thông tin giỏ hàng (Để hiển thị số lượng trên menu)
    res.locals.cart = req.session.cart || [];
    
    next();
});

// --- 6. ĐỊNH TUYẾN (ROUTES)  ---

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