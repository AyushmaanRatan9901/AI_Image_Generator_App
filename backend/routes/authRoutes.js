import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfiles,
} from "../Controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", registerUser);
router.post("/login", loginUser);

// User Profile Routes with protect
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("file"), updateUserProfiles);

export default router;
