import express from "express";
import { getProjects, createProject, updateProject, deleteProject, getProjectById } from "../controllers/projectController.js";
const router = express.Router();

router.get("/get-projects", getProjects);
router.post("/create-project", createProject);
router.put("/update-project/:id", updateProject);
router.delete("/delete-project/:id", deleteProject);
router.get("/detail-project/:id", getProjectById);

export default router;