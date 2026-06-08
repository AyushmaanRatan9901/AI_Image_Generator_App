import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";

dotenv.config();

// Connect to Databse
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

//Use Routes
app.use("/api/auth", authRoutes);

// image Routes
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send("Server is Running");
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server is Running on :", `http://localhost:${PORT}/`);
});
