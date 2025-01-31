import express from "express";
import {
  getTasks,
  addTask,
  deleteTask,
  editTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTasks); // Fetch tasks for logged-in user only
router.post("/", protect, addTask); // Add task for logged-in user
router.put("/:id", protect, editTask); // Edit user's own task
router.delete("/:id", protect, deleteTask); // Delete user's own task

export default router;
