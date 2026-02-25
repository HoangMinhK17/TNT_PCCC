import express from "express";
import { createIntroductCompany, getAllIntroductCompany, getCoreValues, getIntroductCompany, getMissionVision } from "../controllers/introductController.js";
const router = express.Router();

router.post("/create-introduct-company", createIntroductCompany);
router.get("/get-all", getAllIntroductCompany);
router.get("/get-introduct-company", getIntroductCompany);
router.get("/get-mission-vision", getMissionVision);
router.get("/get-core-values", getCoreValues);

export default router;
