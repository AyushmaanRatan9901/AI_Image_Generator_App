import Prompt from "../models/Prompt.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
// Create a new prompt
export const createPrompt = async (req, res) => {
  try {
    const { prompt, chatId } = req.body;

    // Safety check: ensure the middleware actually populated req.user
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "User authentication failed. req.user is null." });
    }

    if (!prompt) return res.status(400).json({ message: "Prompt is required" });
    if (!chatId)
      return res.status(400).json({ message: "Chat ID is required" });

    let imageUrl = null;

    if (req.file && req.file.buffer) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "prompts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      imageUrl = result.secure_url;
    }

    const newPrompt = new Prompt({
      prompt,
      imageUri: imageUrl,
      userId: req.user._id,
      chatId: chatId,
      createdAt: new Date(),
    });
    await newPrompt.save();

    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("Error creating prompt:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get all prompts
export const getPrompts = async (req, res) => {
  try {
    const { chatId } = req.query; // Optionally filter by chatId via query params
    const filter = { userId: req.user._id };

    if (chatId) filter.chatId = chatId;

    const prompts = await Prompt.find(filter).sort({ createdAt: -1 });
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserGallery = async (req, res) => {
  try {
    // Fetch only documents where imageUri is not null
    const gallery = await Prompt.find({
      userId: req.user._id,
      imageUri: { $ne: null },
    }).sort({ createdAt: -1 });

    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gallery" });
  }
};
