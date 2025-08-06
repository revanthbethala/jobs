import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api/users";

export const getProfile = async () => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("No authentication token");

    const response = await axios.get(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("No authentication token");
    const response = await axios.put(`${API_BASE}/update-profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
