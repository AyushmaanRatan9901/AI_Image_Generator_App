import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    imageUri: { type: String, default: null },
    // Reference to the user who created it
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Useful for grouping messages in a specific conversation
    chatId: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Prompt", promptSchema);
