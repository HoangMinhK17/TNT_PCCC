import express from "express";
import { createIntroductCompany, getAllIntroductCompany } from "../controllers/introductController.js";
const router = express.Router();

router.post("/create-introduct-company", createIntroductCompany);
router.get("/get-all", getAllIntroductCompany);

export default router;
