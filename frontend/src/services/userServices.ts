import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const token = useAuthStore.getState().token;
const backend_url = import.meta.env.VITE_BACKEND_URL;
export const getPaginatedUsers = async (page = 1, limit = 10) => {
  const { data } = await axios.get(
    `${backend_url}/api/users?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
