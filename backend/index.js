import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import promptRoutes from "./routes/promptRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Server is Running 🚀"));
app.get("/health", (req, res) =>
  res.json({ status: "ok", message: "Backend is connected 🚀" }),
);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () =>
  console.log("Server running on port", PORT),
);
