import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Better to use .env
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;
