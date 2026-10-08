import rateLimit from "express-rate-limit";

/**
 * Giới hạn chung cho toàn bộ API
 * - 100 request / 1 phút mỗi IP
 * - Dùng để chống spam F5, crawl liên tục
 */
export const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 phút
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Bạn đang gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút!",
    },
});

/**
 * Giới hạn nghiêm ngặt cho các API nhạy cảm:
 * - Đăng nhập, Quên mật khẩu, Reset mật khẩu
 * - 10 lần / 15 phút mỗi IP
 * - Dùng để chống brute-force mật khẩu
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Bạn đã thử quá nhiều lần. Vui lòng đợi 15 phút và thử lại!",
    },
});

/**
 * Giới hạn cho các API gửi form công khai:
 * - Gửi liên hệ, Nộp đơn ứng tuyển
 * - 5 lần / 10 phút mỗi IP
 * - Dùng để chống spam email/đơn ứng tuyển
 */
export const formSubmitLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 phút
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Bạn đã gửi quá nhiều lần. Vui lòng đợi 10 phút và thử lại!",
    },
});
