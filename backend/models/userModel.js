import { timeStamp } from "console";
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      type: String,
      default: "",
    },
    phone: { type: String, default: "" },
  },
  { timeStamp: true },
);

const User = mongoose.model("User", userSchema);

export default User;
