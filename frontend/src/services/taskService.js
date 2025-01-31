// src/services/taskService.js
import axios from "axios";
import { taskUrl } from "./URL";

const authHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No auth token found");
    return {}; // Return empty headers to avoid sending undefined
  }
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};



export const fetchTasks = async () => {
  try {
    const { data } = await axios.get(taskUrl, authHeader());
    return data;
  } catch (error) {
    console.error(
      "Error fetching tasks:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addTask = async (task) => {
  try {
    const { data } = await axios.post(taskUrl, task, authHeader());
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
  try {
    await axios.delete(`${taskUrl}/${id}`, authHeader());
  } catch (error) {
    console.error(
      "Error deleting task:",
      error.response?.data || error.message
    );
    throw error;
  }
};
