import express from "express";
import {
    getWhyChooseCompany,
    createWhyChooseCompany,
    updateWhyChooseCompany,
    deleteWhyChooseCompany,
    getWhyChooseCompanyForManage
} from "../controllers/whyChooseCompanyController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/get-why-choose-company", getWhyChooseCompany);
router.post("/create-why-choose-company", authMiddleware, createWhyChooseCompany);
router.put("/update-why-choose-company/:id", authMiddleware, updateWhyChooseCompany);
router.delete("/delete-why-choose-company/:id", authMiddleware, deleteWhyChooseCompany);
router.get("/get-why-choose-company-for-manage", authMiddleware, getWhyChooseCompanyForManage);

export default router;