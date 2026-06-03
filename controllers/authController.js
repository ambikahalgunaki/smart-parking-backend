const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'spms_super_secret_key_2024';

exports.login = async (req, res) => {
    console.log("👉 Login route hit! Email:", req.body.email); // <-- This will print in backend terminal
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        let user = await User.findOne({ email });
        
        if (!user) {
            const hashedPassword = await bcrypt.hash('default', 10);
            user = await User.create({ email: 'admin@spms.com', password: hashedPassword, isFirstLogin: true });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            success: true,
            token,
            user: { id: user._id, email: user.email, isFirstLogin: user.isFirstLogin }
        });
    } catch (error) {
        console.error("❌ BACKEND LOGIN CRASH:", error); // <-- THIS WILL SHOW THE REAL ERROR
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.setPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.isFirstLogin = false;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password updated' });
    } catch (error) {
        console.error("❌ SET PASSWORD CRASH:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Get User Details
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};