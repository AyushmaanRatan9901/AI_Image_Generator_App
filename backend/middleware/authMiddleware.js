import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorixed" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not Authorized , no token" });
  }
};
