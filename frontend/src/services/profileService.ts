import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api/users"; // Ensure this is set in your .env

const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

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

// ✅ Update user profile
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

// ✅ Upload file (resume or profile picture)
export const uploadFile = async (
  file: File,
  type: "resume" | "profilePicture"
): Promise<string> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("No authentication token");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const result = await response.json();
    return result.url; // backend must return `url` or update accordingly
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
