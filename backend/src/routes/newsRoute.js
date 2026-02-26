import express from "express";
import { createNews, getNews, updateNews, deleteNews, getNewsByCategoryId, getNewsById, getNewsByName, getNewsBySearch } from "../controllers/newsController.js";

const router = express.Router();

router.get("/get-news", getNews);
router.post("/create-news", createNews);
router.put("/update-news/:id", updateNews);
router.delete("/delete-news/:id", deleteNews);
router.get("/get-news-by-category-id/:categoryNewsId", getNewsByCategoryId);
router.get("/get-news-by-id/:id", getNewsById);
router.get("/get-news-by-name/:name", getNewsByName);
router.get("/get-news-by-search/:searchTerm", getNewsBySearch);


export default router;