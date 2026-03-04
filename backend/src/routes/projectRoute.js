import express from "express";
import { getProjects, createProject, updateProject, deleteProject, getProjectById, getProjectByName, getProjectsForManage } from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/get-projects", getProjects);
router.post("/create-project", authMiddleware, createProject);
router.put("/update-project/:id", authMiddleware, updateProject);
router.delete("/delete-project/:id", authMiddleware, deleteProject);
router.get("/detail-project/:id", getProjectById);
router.get("/get-project-by-name/:name", getProjectByName);
router.get("/get-projects-for-manage", authMiddleware, getProjectsForManage);


export default router;