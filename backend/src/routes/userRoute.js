import express from "express";
import { createUser, getAllUsers, loginUser, updateTheme, getAdminTheme, changePassword, updateInfo } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
//User
router.post("/create-user",authMiddleware, createUser);
router.get("/get-all-users",authMiddleware, getAllUsers);
router.post("/login-user", loginUser);
router.put("/update-theme", authMiddleware, updateTheme);
router.get("/admin-theme", getAdminTheme);
router.put("/change-password",authMiddleware, changePassword);
router.put("/update-info",authMiddleware, updateInfo);


export default router;
