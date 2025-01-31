// services/URL.js
// Dynamically set the base URL based on the environment
const isLocalhost = window.location.hostname === "localhost";

export const baseUrl = isLocalhost
  ? "http://localhost:1112"
  : import.meta.env.VITE_BASE_URL; // For Vite - backend link


export const taskUrl = `${baseUrl}/tasks`;

export const userUrl = `${baseUrl}/user`;
