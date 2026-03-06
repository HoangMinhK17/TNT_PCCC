import express from "express";
import { createUser, getAllUsers } from "../controllers/userController.js";
import userRouter from "./userRoute.js";
import introductRouter from "./introductRoute.js";
import categoryProductRouter from "./categoryProductRoute.js";
import productRouter from "./productRoute.js";
import serviceRouter from "./serviceRoute.js";
import projectRouter from "./projectRoute.js";
import partnerRouter from "./partnerRoute.js";
import recruitmentRouter from "./recruitmentRoute.js";
import categoryNewsRouter from "./categoryNewsRoute.js";
import newsRouter from "./newsRoute.js";
import informationRouter from "./informationRoute.js";
import whyChooseServiceRouter from "./whyChooseServiceRoute.js";
import whyChooseCompanyRouter from "./whyChooseCompanyRoute.js";
import uploadRouter from "./uploadRoute.js";
import contactRouter from "./contactRoute.js";
import contactRecruitmentRouter from "./contactRecruitmentRoute.js";


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

//Partner
router.use("/partner", partnerRouter);

//Recruiment
router.use("/recruitment", recruitmentRouter);

//CategoryNews
router.use("/categoryNews", categoryNewsRouter);

//News
router.use("/news", newsRouter);

//Information
router.use("/information", informationRouter);

//WhyChooseService
router.use("/whyChooseService", whyChooseServiceRouter);

//WhyChooseCompany
router.use("/whyChooseCompany", whyChooseCompanyRouter);

//Upload
router.use("/upload", uploadRouter);

//Contact
router.use("/contact", contactRouter);

//ContactRecruitment
router.use("/contactRecruitment", contactRecruitmentRouter);


export default router;
