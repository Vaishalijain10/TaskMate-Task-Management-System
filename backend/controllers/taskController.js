import Task from "../models/taskModel.js";

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Add a new task
export const addTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }

    const newTask = new Task({ title, description, status });
    const savedTask = await newTask.save();

    return res.status(201).json(savedTask); // Return saved task
  } catch (error) {
    console.error("Error adding task:", error);
    return res.status(500).json({ message: "Error adding task", error });
  }
};

// edit a task
// Update a task
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Ensure that all required fields are provided
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }

    // Find the task by ID and update it
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask); // Return the updated task data
  } catch (error) {
    console.error("Error editing task:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
