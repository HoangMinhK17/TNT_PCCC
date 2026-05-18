import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import sendMail from "../config/sendMail.js";
import crypto from "crypto";
import Information from "../models/Information.js";
import AuditLog from "../models/AuditLog.js";
import Session from "../models/Session.js";
import { emitForceLogout } from "../config/socket.js";

const createUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, email, role } = req.body;
        const emailCheck = await User.findOne({ email })
        if (emailCheck) {
            return res.status(404).json({ message: "Email đã tồn tại" })
        }

        const randomPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        const user = await User.create({ name, email, password: hashedPassword, role });
        await AuditLog.create({
            module: "Quản lý người dùng",
            action: "create",
            recordId: user._id,
            recordName: user.name,
            userId: req.user.id,
        });
        res.status(200).json(user);
        sendMail(email, "CẤP TÀI KHOẢN", "Tài khoản của bạn đã được cấp thành công vào lúc "
            + new Date().toLocaleString("vi-VN")
            + "\n Email: " + email
            + "\n Mật khẩu: " + randomPassword
            + "\n Vui lòng đổi mật khẩu sau khi đăng nhập!", "", "");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatusUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { userId, status, role } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        const oldUser = await User.findById(userId);
        if (oldUser.role === "admin") {
            return res.status(404).json({ message: "Không thể thay đổi quyền và trạng thái của Admin" });
        }
        const getThemeAdmin = await User.findOne({ role: "admin" })
        if (role == "admin") {
            user.theme = getThemeAdmin.theme;
        }

        user.role = role;
        user.status = status;
        await user.save();
        const oldValues = {};
        const newValues = {};
        let hasChanges = false;

        if (oldUser.role !== user.role) {
            oldValues.role = oldUser.role;
            newValues.role = user.role;
            hasChanges = true;
        }

        if (oldUser.status !== user.status) {
            oldValues.status = oldUser.status;
            newValues.status = user.status;
            hasChanges = true;
        }

        if (hasChanges) {
            await AuditLog.create({
                module: "Quản lý người dùng",
                action: "update",
                recordId: user._id,
                recordName: user.name,
                userId: req.user.id,
                oldValues: oldValues,
                newValues: newValues,
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalUsers = await User.countDocuments();
        const users = await User.find()
            .sort({ role: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('name email role status')
            .lean();
        res.status(200).json({
            users,
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, deviceId } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Sai mật khẩu" });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name }
            , process.env.JWT_SECRET
            , { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        const refreshToken = jwt.sign(
            { id: user._id, role: user.role, name: user.name }
            , process.env.JWT_SECRET_REFRESH
            , { expiresIn: process.env.JWT_EXPIRES_IN_REFRESH }
        )

        let session;
        if (deviceId) {
            session = await Session.findOne({ userId: user._id, deviceId: deviceId });
        }

        if (session) {
            session.ip = req.userInfo.ip;
            session.browser = req.userInfo.browser;
            session.os = req.userInfo.os;
            session.platform = req.userInfo.platform;
            session.refreshToken = refreshToken;
            session.isActive = true;
            session.lastActive = Date.now();
            await session.save();
        } else {
            session = await Session.create({
                userId: user._id,
                deviceId: deviceId,
                ip: req.userInfo.ip,
                browser: req.userInfo.browser,
                os: req.userInfo.os,
                platform: req.userInfo.platform,
                refreshToken: refreshToken,
                isActive: true,
                lastActive: Date.now()
            });
        }
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            token, refreshToken, session, user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
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
            return res.status(403).json({ message: "Forbidden" });
        }
        const { theme } = req.body;
        const userId = req.user.id;

        const oldUser = await User.findById(userId);
        if (!oldUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        await User.updateMany({ role: "admin" }, { theme: theme });

        if (oldUser.theme !== theme) {
            await AuditLog.create({
                module: "Cấu hình hệ thống",
                action: "update",
                recordId: oldUser._id,
                recordName: "Cấu hình theme (UI)",
                userId: req.user.id,
                oldValues: { theme: oldUser.theme },
                newValues: { theme: theme },
            });
        }

        res.status(200).json({ message: "Cập nhật theme thành công", theme: theme });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdminTheme = async (req, res) => {
    try {
        const admin = await User.findOne({ role: "admin" })
            .select('theme')
            .lean();
        res.status(200).json({ theme: admin && admin.theme ? admin.theme : 'corporate-red' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
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

        await AuditLog.create({
            module: "Cập nhật tài khoản",
            action: "update",
            recordId: req.user.id,
            recordName: "Thay đổi mật khẩu",
            userId: req.user.id,
        });
        res.status(200).json(user);
        sendMail(user.email, "ĐỔI MẬT KHẨU", "Mật khẩu của bạn đã được thay đổi thành công vào lúc "
            + new Date().toLocaleString("vi-VN"), "", "");

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateInfo = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name } = req.body;
        const userId = req.user.id;

        const oldUser = await User.findById(userId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        user.name = name;
        await user.save();

        if (oldUser.name !== user.name) {
            await AuditLog.create({
                module: "Cập nhật tài khoản",
                action: "update",
                recordId: req.user.id,
                recordName: "Cập nhật thông tin cá nhân",
                userId: req.user.id,
                oldValues: { name: oldUser.name },
                newValues: { name: user.name },
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        const token = crypto.randomBytes(32).toString("hex");
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");
        user.passwordResetToken = hashToken;
        const dateExpires = new Date(Date.now() + 10 * 60 * 1000);
        const expiresInMinutes = Math.round((dateExpires - Date.now()) / (60 * 1000));
        user.passwordResetExpires = dateExpires;
        await user.save();
        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/admin/reset-password/${token}`;

        let logoUrl = "";
        const info = await Information.findOne();
        if (info && info.logo) {
            logoUrl = info.logo;
        }
        const companyName = info ? info.name : "";

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfdfd; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${logoUrl}" alt="${companyName} Logo" style="max-height: 80px; max-width: 200px; object-fit: contain;" />
            </div>
            <h2 style="color: #333333; text-align: center; border-bottom: 2px solid #efefef; padding-bottom: 10px;">Khôi phục mật khẩu</h2>
            <p style="color: #555555; line-height: 1.6; font-size: 16px;">
                Xin chào <strong>${user.name || user.email}</strong>,
            </p>
            <p style="color: #555555; line-height: 1.6; font-size: 16px;">
                Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để tiến hành tạo mật khẩu mới. Đường dẫn này sẽ hết hạn trong <strong>${expiresInMinutes} phút</strong>.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,123,255,0.3);">Đặt Lại Mật Khẩu</a>
            </div>
            <p style="color: #777777; font-size: 14px; text-align: center; line-height: 1.5;">
                Nếu bạn không yêu cầu thay đổi mật khẩu này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            <p style="color: #999999; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.<br>
                Email tự động, vui lòng không trả lời.
            </p>
        </div>
        `;

        sendMail(user.email, `ĐẶT LẠI MẬT KHẨU`, `Vui lòng click vào đường dẫn sau để đặt lại mật khẩu của bạn:\n\n${resetLink}`, htmlContent);
        res.status(200).json({ message: "Reset token sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashToken
            , passwordResetExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(404).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();
        res.status(200).json({ message: "Reset password successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllSessions = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const { isActive, search } = req.query;

        const sessionFilter = {};
        if (isActive !== undefined && isActive !== '') {
            sessionFilter.isActive = isActive === 'true';
        }

        let userIds = null;
        if (search && search.trim()) {
            const users = await User.find({
                $or: [
                    { name: { $regex: search.trim(), $options: 'i' } },
                    { email: { $regex: search.trim(), $options: 'i' } }
                ]
            }).select('_id').lean();
            userIds = users.map(u => u._id);
            sessionFilter.userId = { $in: userIds };
        }

        const total = await Session.countDocuments(sessionFilter);
        const sessions = await Session.find(sessionFilter)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();

        res.status(200).json({ sessions, total, page, pageSize });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutSession = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const session = await Session.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Không tìm thấy phiên đăng nhập" });
        }
        if (!session.isActive) {
            return res.status(400).json({ message: "Phiên đăng nhập này đã bị vô hiệu hóa" });
        }
        session.isActive = false;
        await session.save();

        emitForceLogout(
            session.deviceId,
            "Phiên đăng nhập của bạn đã bị quản trị viên đăng xuất."
        );

        await AuditLog.create({
            module: "Quản lý thiết bị",
            action: "update",
            recordId: session._id,
            recordName: `Đăng xuất thiết bị – ${session.browser || ''} / ${session.os || ''} (${session.ip || ''})`,
            userId: req.user.id,
            oldValues: { isActive: true },
            newValues: { isActive: false },
        });

        res.status(200).json({ message: "Đăng xuất thiết bị thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: "Không tìm thấy refresh token" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        const session = await Session.findOne({ refreshToken, isActive: true });
        if (!session) {
            return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã bị đăng xuất" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Người dùng không tồn tại" });
        }

        const newToken = jwt.sign(
            { id: user._id, role: user.role, name: user.name }
            , process.env.JWT_SECRET
            , { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ token: newToken });
    } catch (error) {
        return res.status(401).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" });
    }
};

const deleteSession = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const session = await Session.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Không tìm thấy phiên đăng nhập" });
        }

        await session.deleteOne();
        await AuditLog.create({
            module: "Quản lý thiết bị",
            action: "delete",
            recordId: session._id,
            recordName: `Xóa phiên đăng nhập – ${session.browser || ''} / ${session.os || ''} (${session.ip || ''})`,
            userId: req.user.id,
        });

        res.status(200).json({ message: "Xóa phiên đăng nhập thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {
    createUser, getAllUsers, loginUser, updateTheme, getAdminTheme, changePassword
    , updateInfo, forgotPassword, resetPassword, getAllSessions, logoutSession, refreshToken
    , deleteSession, updateStatusUser
};