import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    let profileImageUrl = null;

    // 1. If an image is uploaded, send it to Cloudinary
    if (req.file && req.file.buffer) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      profileImageUrl = result.secure_url;
    }

    // 2. Find user and update
    const updateData = {};
    if (name) updateData.name = name;
    if (profileImageUrl) updateData.profileImage = profileImageUrl;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true },
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};
