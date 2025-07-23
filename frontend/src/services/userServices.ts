import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;
export const getPaginatedUsers = async (page = 1, limit = 10) => {
  const token = useAuthStore.getState().token;
  try {
    const { data } = await axios.get(
      `${backend_url}/api/users?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAdminDashboard = async () => {
  const token = useAuthStore.getState().token;
  try {
    const { data } = await axios.get(`${backend_url}/api/users/userDashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
