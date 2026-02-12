import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../Utils/generateToken.js";
import cloudinary from "../Config/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. check if user alreasy exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    //2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 3. Create User
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For Login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User by Email
    const user = await User.findOne({ email });
    // 2. Password Check
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid Email and Password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get UserProfile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
export const updateUserProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.profile = req.body.profile || user.profile;

      // If password is sent, update it (hashing handled by pre-save hook usually, or here manually)
      if (req.body.password) {
        // You should hash the password here if you are updating it
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(req.body.password, salt);
      }

      // 3. Check if a file was sent
      if (req.file) {
        try {
          // Convert file buffer to Base64 to upload to Cloudinary
          const b64 = Buffer.from(req.file.buffer).toString("base64");
          let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

          const cldRes = await cloudinary.uploader.upload(dataURI, {
            folder: "profile", // Save to 'profile' folder
          });

          // Save the new Cloudinary URL to database
          user.profile = cldRes.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          return res.status(500).json({ message: "Image upload failed" });
        }
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        profile: updatedUser.profile,
      });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
