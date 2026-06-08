import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  createChat,
  getUserChats,
  getChatById,
  addMessageToChat, // Ensure this is imported
  getUserGallery, // Ensure this is imported
} from "../Controllers/chatController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- 1. POST Routes (Actions) ---
router.post("/create", protect, createChat);
router.post("/message", protect, upload.single("file"), addMessageToChat);

// --- 2. Specific GET Routes (Must be BEFORE /:id) ---
router.get("/all", protect, getUserChats);
router.get("/gallery", protect, getUserGallery); // 👈 THIS MUST BE HERE

// --- 3. Dynamic GET Route (Must be LAST) ---
// If this was first, it would catch "gallery" and think it's an ID
router.get("/:id", protect, getChatById);

export default router;
