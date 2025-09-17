import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; // Admin মডেল ব্যবহার করুন

export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message:
          err.name === "TokenExpiredError"
            ? "Unauthorized: Token expired"
            : "Unauthorized: Invalid token",
      });
    }

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("❌ Admin Middleware Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};