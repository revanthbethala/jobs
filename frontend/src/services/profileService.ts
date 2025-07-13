import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export interface ProfileData {
  isVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  username: string;
  role: "USER" | "ADMIN";
  fatherName: string;
  motherName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  profilePicture: string;
  resume: string;
  education: EducationItem[];
}

export interface EducationItem {
  id?: string;
  educationalLevel?: string;
  institution: string;
  specialization?: string;
  board: string;
  percentage?: string;
  passedOutYear: string;
  location: string;
  activeBacklogs: number;
}

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api/users"; // Ensure this is set in your .env

// Get authorization headers with token
const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// ✅ Get user profile
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
export const updateProfile = async (
  data: Partial<ProfileData>
): Promise<ProfileData> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE}/update-profile`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return await response.json();
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
