// src/services/taskService.js
import axios from "axios";
import { taskUrl } from "./URL";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchTasks = async () => {
  try {
    const { data } = await axios.get(taskUrl); // Remove authHeader() if not required
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addTask = async (task) => {
  try {
    const { data } = await axios.post(taskUrl, task); // Remove authHeader() for now
    return data;
  } catch (error) {
    console.error("Error adding task:", error.response?.data || error.message);
    throw error;
  }
};

export const editTask = async (id, updatedTask) => {
  try {
    const { data } = await axios.put(
      `${taskUrl}/${id}`,
      updatedTask,
      authHeader()
    );
    return data;
  } catch (error) {
    console.error("Error editing task:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTask = async (id) => {
  await axios.delete(`${taskUrl}/${id}`, authHeader());
};
