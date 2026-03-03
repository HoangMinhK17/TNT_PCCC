import express from "express";
import {
    createIntroductCompany,
    getAllIntroductCompany,
    getCoreValues,
    getIntroductCompany,
    getMissionVision,
    getIntroductCompanyById,
    updateIntroductCompany,
    deleteIntroductCompany,
    updateMissionVision,
    addCoreValuesCompany,
    deleteCoreValuesCompany,
    updateCoreValuesCompany
} from "../controllers/introductController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.get("/get-all", getAllIntroductCompany);
router.get("/get-introduct-company", getIntroductCompany);
router.get("/get-mission-vision", getMissionVision);
router.get("/get-core-values", getCoreValues);
router.get("/get-introduct-company-by-id/:id", getIntroductCompanyById);

router.post("/create-introduct-company", authMiddleware, createIntroductCompany);
router.put("/update-introduct-company/:id", authMiddleware, updateIntroductCompany);
router.delete("/delete-introduct-company/:id", authMiddleware, deleteIntroductCompany);
router.put("/update-mission-vision/:id", authMiddleware, updateMissionVision);
router.post("/add-core-values-company", authMiddleware, addCoreValuesCompany);
router.delete("/delete-core-values-company/:id", authMiddleware, deleteCoreValuesCompany);
router.put("/update-core-values-company/:id", authMiddleware, updateCoreValuesCompany);

export default router;
