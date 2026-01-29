// routes/authRoutes.js
import express from "express";
import { login, signup } from "./../controllers/authController.js";
import multer from "multer";

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/signup", upload.single("profileImage"), signup);
router.post("/login", login);

export default router; // ✅ THIS WAS MISSING
