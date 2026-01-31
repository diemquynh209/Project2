const User = require('../models/User');

const AuthController = {
    // 1. Hiển thị form Đăng nhập
    getLogin: (req, res) => {
        res.render('login', { error: null });
    },

    // 2. Xử lý Đăng nhập
    postLogin: async (req, res) => {
        const { username, password } = req.body;
        
        try {
            // User Model cần có hàm findByUsername trả về đầy đủ thông tin
            const user = await User.findByUsername(username);

            if (!user || user.password !== password) {
                return res.render('login', { error: 'Sai tên đăng nhập hoặc mật khẩu!' });
            }

            // Cập nhật Session với các trường mới
            req.session.userId = user.user_id; // Quan trọng: Dùng cho Checkout và Seller
            req.session.username = user.username;
            req.session.role = user.role;      // Phân quyền (Admin/Seller/Customer)

            // Điều hướng dựa trên vai trò 
            if (user.role === 'Seller') {
                return res.redirect('/seller/dashboard'); 
            }
            
            if (user.role === 'Admin') {
                return res.redirect('/admin/users'); 
            }

            res.redirect('/'); // Khách hàng thì về trang chủ
        } catch (err) {
            console.log(err);
            res.render('login', { error: 'Lỗi hệ thống' });
        }
    },

    // 3. Hiển thị form Đăng ký
    getRegister: (req, res) => {
        res.render('register', { error: null });
    },

    // 4. Xử lý Đăng ký
    postRegister: async (req, res) => {
        try {

            const { username, password, email, full_name, phone, address } = req.body;
            // Gọi Model tạo user mới 
            await User.create({ username, password, email, full_name, phone, address });
            
            res.redirect('/login');
        } catch (err) {
            console.log(err);
            res.render('register', { error: 'Tên đăng nhập đã tồn tại hoặc lỗi hệ thống!' });
        }
    },

    // 5. Đăng xuất
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
};

module.exports = AuthController;