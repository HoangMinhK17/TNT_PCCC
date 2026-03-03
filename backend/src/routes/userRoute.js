import express from "express";
import { createUser, getAllUsers, loginUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
//User
router.post("/create-user",authMiddleware, createUser);
router.get("/get-all-users",authMiddleware, getAllUsers);
router.post("/login-user", loginUser);



export default router;
