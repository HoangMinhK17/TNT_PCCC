import express from "express";
import { createUser, getAllUsers } from "../controllers/userController.js";
import userRouter from "./userRoute.js";
import introductRouter from "./introductRoute.js";
import categoryProductRouter from "./categoryProductRoute.js";
import productRouter from "./productRoute.js";
import serviceRouter from "./serviceRoute.js";
import projectRouter from "./projectRoute.js";

const router = express.Router();
//User
router.use("/user", userRouter);



//Introduct
router.use("/introduct", introductRouter);



//CategoryProduct
router.use("/categoryProduct", categoryProductRouter);

//Product
router.use("/product", productRouter);

//Service
router.use("/service", serviceRouter);

//Project
router.use("/project", projectRouter);
export default router;
