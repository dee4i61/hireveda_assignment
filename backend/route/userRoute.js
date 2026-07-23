import express from "express";
import {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public route — anyone can view a profile
router.get("/:id", getUser);

// Protected routes — admin only
router.post("/", authMiddleware, upload.single("profileImage"), createUser);
router.get("/", authMiddleware, getAllUsers);
router.put("/:id", authMiddleware, upload.single("profileImage"), updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
