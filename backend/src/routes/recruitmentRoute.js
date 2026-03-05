import express from "express";
import { getRecruiments, createRecruiment, updateRecruiment, deleteRecruiment, getRecruimentsForManage, getRecruimentsByName } from "../controllers/recruitmentController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/get-recruiments", getRecruiments);
router.post("/create-recruiment", authMiddleware, createRecruiment);
router.put("/update-recruiment/:id", authMiddleware, updateRecruiment);
router.delete("/delete-recruiment/:id", authMiddleware, deleteRecruiment);
router.get("/get-recruiments-for-manage", authMiddleware, getRecruimentsForManage);
router.get("/get-recruiments-by-name/:name", authMiddleware, getRecruimentsByName);

export default router;