import { useAuthStore } from "@/store/authStore";
import axios from "axios";
const backend_url = import.meta.env.VITE_BACKEND_URL;

export const getAllJobs = async () => {
  try {
    const res = await axios.get(`${backend_url}/api/jobs`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const applyJob = async (jobId, userId) => {
  console.log(userId);
  const token = useAuthStore.getState().token;
  try {
    const res = await axios.post(
      `${backend_url}/api/applications/apply/${jobId}`,
      {userId},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
