import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import Cookie from "js-cookie";
const backend_url = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

// Helper to get token from Zustand store
const getAuthToken = () => {
  const token = Cookie.get("token");
  return token;
};

export const getProfile = async () => {
  try {
    const token = getAuthToken();
    const res = await axios.get(`${backend_url}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    const token = getAuthToken();
    for (const [key, value] of data.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name, value.size, value.type);
      }
      // console.log(`${key}:`, value, typeof value);
    }
    const res = await axios.put(`${backend_url}/update-profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadFile = async (
  file: File,
  type: "resume" | "profilePicture"
) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await axios.post(`${backend_url}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
