import express from "express";
import { getPublicTestimonials, createTestimonial, getPublicTestimonialById, updateTestimonial, deleteTestimonial, searchTestimonial, getTestimonialsForManage } from "../controllers/testimonialController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-public-testimonials", getPublicTestimonials);
router.get("/get-public-testimonial-by-id/:id", getPublicTestimonialById);
router.post("/create-testimonial", authMiddleware, createTestimonial);
router.put("/update-testimonial/:id", authMiddleware, updateTestimonial);
router.delete("/delete-testimonial/:id", authMiddleware, deleteTestimonial);
router.get("/search-testimonial", authMiddleware, searchTestimonial);
router.get("/manage-testimonials", authMiddleware, getTestimonialsForManage);

export default router;

