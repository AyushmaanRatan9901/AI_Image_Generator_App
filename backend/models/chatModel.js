import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      default: "New Conversation",
    },
    messages: [
      {
        role: { type: String, enum: ["user", "bot"], required: true }, // Who sent it?
        type: { type: String, enum: ["text", "image"], required: true }, // Is it text or image?
        content: { type: String, required: true }, // The prompt text or Image URL
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
