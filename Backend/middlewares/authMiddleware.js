
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token. Unauthorized access." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found. Unauthorized." });
    }

    req.user = user; // ✅ Makes user available in all protected routes
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
