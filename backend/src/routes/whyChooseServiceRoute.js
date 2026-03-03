import express from "express";
import { createWhyChooseService, getWhyChooseService, updateWhyChooseService, deleteWhyChooseService } from "../controllers/whyChooseServiceController.js";

const router = express.Router();

router.post("/create-why", createWhyChooseService);
router.get("/get-why", getWhyChooseService);
router.put("/update-why/:id", updateWhyChooseService);
router.delete("/delete-why/:id", deleteWhyChooseService);

export default router;