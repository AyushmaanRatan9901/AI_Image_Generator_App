import express from "express";
import { updateProfile } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"; // Your multer config
import { changePassword } from "../controllers/authController.js";

const router = express.Router();

// This route will be: PUT /api/users/profile
// 'image' must match the key used in your frontend FormData.append("image", ...)
router.put("/profile", protect, upload.single("image"), updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
