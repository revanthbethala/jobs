import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { Trophy } from "lucide-react";
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

export const getJobById = async (job_id: string) => {
  try {
    const res = await axios.get(`${backend_url}/api/jobs/${job_id}`);
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
      { userId },
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

export const getUserApplications = async () => {
  const token = useAuthStore.getState().token;
  try {
    const res = await axios.get(`${backend_url}/api/applications`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const postJob = async (data) => {
  try {
    const token = useAuthStore.getState().token;
    console.log("Data in postJob:", JSON.stringify(data, null, 2));
    const res = await axios.post(`${backend_url}/api/jobs`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
