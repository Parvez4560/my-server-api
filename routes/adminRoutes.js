import express from "express";
import { adminLogin, getAdmins, createAdmin } from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/adminAuth.js"; // আলাদা Admin middleware

const router = express.Router();

// ✅ Login Route (সাধারণ টোকেনের প্রয়োজন নেই)
router.post("/login", adminLogin);

// ✅ Get All Admins (protected, শুধুমাত্র অ্যাডমিনের জন্য)
router.get("/", verifyAdmin, getAdmins);

// ✅ Create Admin (protected, শুধুমাত্র অ্যাডমিনের জন্য)
router.post("/", verifyAdmin, createAdmin);

export default router;