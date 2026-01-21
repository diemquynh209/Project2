const db = require('../utils/db');

class User {
    // Tìm user bằng username (Dùng cho Đăng nhập)
    static async findByUsername(username) {
        const sql = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.execute(sql, [username]);
        return rows[0];
    }

    // Thêm user mới (Dùng cho Đăng ký)
    static async create(userInfo) {
        // Cập nhật SQL để thêm phone và address
        const sql = `
            INSERT INTO users (username, password, email, full_name, phone, address, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Mặc định role là Customer nếu không chọn
        const role = userInfo.role || 'Customer';
        
        await db.execute(sql, [
            userInfo.username,
            userInfo.password,
            userInfo.email,
            userInfo.full_name,
            userInfo.phone || null,   // Nếu không có thì để null
            userInfo.address || null, // Nếu không có thì để null
            role
        ]);
    }
}

module.exports = User;