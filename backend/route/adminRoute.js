import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} from "../controller/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/profile", authMiddleware, getAdminProfile);

export default router;
