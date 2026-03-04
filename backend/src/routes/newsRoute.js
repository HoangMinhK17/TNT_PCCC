import express from "express";
import { createNews, getNews, updateNews, deleteNews, getNewsByCategoryId, getNewsById, getNewsByName, getNewsBySearch, getNewsForManage, getNewsByCategoryIdAdmin } from "../controllers/newsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-news", getNews);
router.post("/create-news",authMiddleware, createNews);
router.put("/update-news/:id",authMiddleware, updateNews);
router.delete("/delete-news/:id",authMiddleware, deleteNews);
router.get("/get-news-by-category-id/:categoryNewsId", getNewsByCategoryId);
router.get("/get-news-by-id/:id", getNewsById);
router.get("/get-news-by-name/:name",authMiddleware, getNewsByName);
router.get("/get-news-by-search/:searchTerm", getNewsBySearch);
router.get("/get-news-for-manage", authMiddleware, getNewsForManage);
router.get("/get-news-by-category-id-admin/:categoryNewsId", authMiddleware, getNewsByCategoryIdAdmin);



export default router;