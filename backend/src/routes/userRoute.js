import express from "express";
import { createUser, getAllUsers } from "../controllers/userController.js";

const router = express.Router();
//User
router.post("/create-user", createUser);
router.get("/get-all-users", getAllUsers);




//

export default router;
