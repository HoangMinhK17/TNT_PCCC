import express from "express";
import {
    createCategoryNews,
    getCategoryNews,
    updateCategoryNews,
    deleteCategoryNews,
    getCategoryNewsForManage,
    searchCategoryNews,
    getCategoryNewsForManageForm,
    updateCategoryNewsOrder
} from "../controllers/categoryNewsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-category-news", getCategoryNews);
router.post("/create-category-news", authMiddleware, createCategoryNews);
router.put("/update-category-news/:id", authMiddleware, updateCategoryNews);
router.delete("/delete-category-news/:id", authMiddleware, deleteCategoryNews);
router.get("/get-category-news-for-manage", authMiddleware, getCategoryNewsForManage);
router.get("/search-category-news/:name", authMiddleware, searchCategoryNews);
router.get("/get-category-news-for-manage-form", authMiddleware, getCategoryNewsForManageForm);
router.put("/reorder", authMiddleware, updateCategoryNewsOrder);

export default router;