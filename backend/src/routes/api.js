import express from "express";
import { createUser, getAllUsers } from "../controllers/userController.js";
import userRouter from "./userRoute.js";
import introductRouter from "./introductRoute.js";

const router = express.Router();
//User
router.use("/user", userRouter);



//Introduct
router.use("/introduct", introductRouter);
export default router;
