import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import Admin from "./models/Admin.js"; // নিশ্চিত করুন মডেল ফাইলের পাথ সঠিক

// ✅ ES Module setup for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// ✅ MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ✅ Function to create predefined Admin
async function createAdmin() {
  try {
    const existing = await Admin.findOne({ email: "salafipay@gmail.com" });
    if (existing) {
      console.log("⚠️ Admin already exists:", existing.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("2233", 10); // Admin password

    const admin = new Admin({
      name: "Parvez",
      email: "salafipay@gmail.com",
      phone: "+8801339770386",
      password: hashedPassword,
      role: "admin",
      status: true,
    });

    await admin.save();
    console.log("✅ Admin created successfully:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
}

// ✅ Run the function
createAdmin();