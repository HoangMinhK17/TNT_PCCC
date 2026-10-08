import express from "express";
import {
    createUser,
    getAllUsers,
    loginUser,
    updateTheme,
    getAdminTheme,
    changePassword,
    updateInfo,
    forgotPassword,
    resetPassword,
    getAllSessions,
    logoutSession,
    refreshToken,
    deleteSession,
    updateStatusUser
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/create-user", authMiddleware, createUser);
router.get("/get-all-users", authMiddleware, getAllUsers);
router.put("/update-status", authMiddleware, updateStatusUser);
router.post("/login-user", authLimiter, loginUser);
router.put("/update-theme", authMiddleware, updateTheme);
router.get("/admin-theme", getAdminTheme);
router.put("/change-password", authMiddleware, changePassword);
router.put("/update-info", authMiddleware, updateInfo);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

// Session / Device management
router.get("/sessions", authMiddleware, getAllSessions);
router.put("/sessions/:id/logout", authMiddleware, logoutSession);
router.post("/refresh-token", refreshToken);
router.delete("/sessions/delete/:id", authMiddleware, deleteSession);

export default router;
