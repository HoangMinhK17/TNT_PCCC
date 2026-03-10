import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Không tìm thấy token xác thực hoặc sai định dạng" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
        }
        res.status(401).json({ message: "Xác thực không thành công (Token không hợp lệ)" });
    }
};

export { authMiddleware };  