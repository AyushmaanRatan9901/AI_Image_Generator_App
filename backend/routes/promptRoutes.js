import express from "express";
import {
  createPrompt,
  getPrompts,
  getUserGallery,
} from "../controllers/promptController.js";
import upload from "../middlewares/uploadMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createPrompt);
router.get("/", protect, getPrompts);
router.get("/gallery", protect, getUserGallery);

export default router;
