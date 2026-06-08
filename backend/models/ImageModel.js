import mongoose from "mongoose";
import { timeStamp } from "node:console";

const imageSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    prompt: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: true,
  },
);

const Image = mongoose.model("Image", imageSchema);
export default Image;
