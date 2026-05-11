import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
    getPublicServices,
    createService,
    getPublicServiceById,
    getServicesForManage,
    searchService,
    updateService,
    deleteService
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/publicService", getPublicServices);
router.post("/createService", authMiddleware, createService);
router.get("/getPublicServiceById/:id", getPublicServiceById);
router.get("/getServicesForManage", authMiddleware, getServicesForManage);
router.get("/searchService", authMiddleware, searchService);
router.put("/updateService/:id", authMiddleware, updateService);
router.delete("/deleteService/:id", authMiddleware, deleteService);

export default router;