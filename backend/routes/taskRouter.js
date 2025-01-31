import express from "express";
import {
  getTasks,
  addTask,
  deleteTask,
  editTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks); // Fetch all tasks
router.post("/", addTask); // Add a new task
router.put("/:id", editTask);
router.delete("/:id", deleteTask); // Delete a task by ID

export default router;
