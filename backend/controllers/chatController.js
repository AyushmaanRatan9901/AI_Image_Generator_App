import cloudinary from "../Config/cloudinary.js";
import Chat from "../models/chatModel.js";

// 1. Create a New Chat
export const createChat = async (req, res) => {
  try {
    const { firstPrompt } = req.body; // Optional: Use first prompt as title
    const title = firstPrompt
      ? firstPrompt.substring(0, 30) + "..."
      : "New Chat";

    const newChat = await Chat.create({
      user: req.user._id,
      title: title,
      messages: [],
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error("❌ Create Chat Error:", error);
    res.status(500).json({ message: "Failed to create chat" });
  }
};

// 2. Get User's Chat List (For Sidebar)
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select("title updatedAt") // Only fetch title and date for sidebar efficiency
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error("❌ Fetch Chats Error:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

// 3. Get Full History of a Single Chat
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    console.log(
      `📖 Loaded Chat: ${chat.title} (${chat.messages.length} messages)`,
    );
    res.json(chat);
  } catch (error) {
    console.error("❌ Load Chat Error:", error);
    res.status(500).json({ message: "Failed to load chat" });
  }
};

// 4. Save Image & Prompt to a Chat
export const addMessageToChat = async (req, res) => {
  try {
    const { chatId, prompt } = req.body;

    if (!req.file || !prompt || !chatId) {
      return res
        .status(400)
        .json({ message: "Missing data (file, prompt, or chatId)" });
    }

    // A. Upload Image to Cloudinary
    console.log("⬆️ Uploading to Cloudinary...");
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const mime = req.file.mimetype || "image/jpeg";
    const dataURI = `data:${mime};base64,${b64}`;

    const cldRes = await cloudinary.uploader.upload(dataURI, {
      folder: "ai_chat_generations",
    });
    console.log("✅ Cloudinary Upload Success:", cldRes.secure_url);

    // B. Find Chat & Update
    const chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // C. Push 2 Messages: User Prompt & Bot Image
    const userMsg = { role: "user", type: "text", content: prompt };
    const botMsg = { role: "bot", type: "image", content: cldRes.secure_url };

    chat.messages.push(userMsg, botMsg);

    // Update title if it's the very first interaction
    if (chat.messages.length <= 2) {
      chat.title = prompt.substring(0, 30) + "...";
    }

    await chat.save();

    console.log("💾 Saved to DB. Total messages:", chat.messages.length);
    res.json(chat); // Return updated chat data
  } catch (error) {
    console.error("❌ Save Message Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- 5. Get All Images (Gallery View) ---
export const getUserGallery = async (req, res) => {
  try {
    const images = await Chat.aggregate([
      { $match: { user: req.user._id } }, // 1. Find user's chats
      { $unwind: "$messages" }, // 2. Break arrays into individual messages
      { $match: { "messages.type": "image" } }, // 3. Filter only images
      { $sort: { "messages.createdAt": -1 } }, // 4. Newest first
      {
        $project: {
          _id: 1, // Chat ID (For navigation)
          imageUrl: "$messages.content",
          createdAt: "$messages.createdAt",
          prompt: "$title", // Using Chat Title as the label
        },
      },
    ]);

    res.json(images);
  } catch (error) {
    console.error("Gallery Error:", error);
    res.status(500).json({ message: "Failed to load gallery" });
  }
};
