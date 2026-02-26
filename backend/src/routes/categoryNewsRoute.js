import express from "express";
import { createCategoryNews, getCategoryNews, updateCategoryNews, deleteCategoryNews } from "../controllers/categoryNewsController.js";

const router = express.Router();

router.get("/get-category-news", getCategoryNews);
router.post("/create-category-news", createCategoryNews);
router.put("/update-category-news/:id", updateCategoryNews);
router.delete("/delete-category-news/:id", deleteCategoryNews);

export default router;