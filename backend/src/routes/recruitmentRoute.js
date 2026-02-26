import express from "express";
import { getRecruiments, createRecruiment, updateRecruiment, deleteRecruiment } from "../controllers/recruitmentController.js";
const router = express.Router();

router.get("/get-recruiments", getRecruiments);
router.post("/create-recruiment", createRecruiment);
router.put("/update-recruiment/:id", updateRecruiment);
router.delete("/delete-recruiment/:id", deleteRecruiment);

export default router;