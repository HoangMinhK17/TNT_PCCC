import express from "express";
import { getWhyChooseCompany, createWhyChooseCompany, updateWhyChooseCompany, deleteWhyChooseCompany } from "../controllers/whyChooseCompanyController.js";

const router = express.Router();

router.get("/get-why-choose-company", getWhyChooseCompany);
router.post("/create-why-choose-company", createWhyChooseCompany);
router.put("/update-why-choose-company/:id", updateWhyChooseCompany);
router.delete("/delete-why-choose-company/:id", deleteWhyChooseCompany);

export default router;