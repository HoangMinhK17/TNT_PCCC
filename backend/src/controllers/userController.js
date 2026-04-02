import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Sai mật khẩu" });
        }
        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.status(200).json({
            token, user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                theme: user.theme
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateTheme = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Không có quyền" });
        }
        const { theme } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        user.theme = theme;
        await user.save();

        res.status(200).json({ message: "Cập nhật theme thành công", theme: user.theme });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdminTheme = async (req, res) => {
    try {
        const admin = await User.findOne({ role: "admin" }).select('theme');
        res.status(200).json({ theme: admin ? admin.theme : 'corporate-red' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "user") {
            return res.status(403).json({ message: "forbidden" });
        }
        const { password, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Mật khẩu cũ không đúng" });
        }
        if (password === newPassword) {
            return res.status(404).json({ message: "Mật khẩu mới không được trùng với mật khẩu cũ" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateInfo = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "user") { 
            return res.status(403).json({ message: "forbidden" });
        }
        const { name } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        user.name = name;
        await user.save();

        res.status(200).json({ message: "Cập nhật thông tin thành công", user: { name: user.name } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createUser, getAllUsers, loginUser, updateTheme, getAdminTheme, changePassword, updateInfo };