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

export const applyJob = async (jobId) => {
  const token = useAuthStore.getState().token;
  console.log(`Applying to job with ID: ${jobId}`);
  console.log(`Token: ${token}`);
  try {
    const res = await axios.post(
      `${backend_url}/api/applications/apply/${jobId}`,
      {jobId},
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

export const getJobApplications = async (jobId: string) => {
  const token = useAuthStore.getState().token;
  try {
    const res = await axios.get(
      `${backend_url}/api/applications/job/${jobId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const postJob = async (data) => {
  try {
    const token = useAuthStore.getState().token;
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

export const updateJob = async (data, jobId) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await axios.put(`${backend_url}/api/jobs/${jobId}`, data, {
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

export const deleteJob = async (jobId: string) => {
  const token = useAuthStore.getState().token;
  try {
    const res = await axios.delete(`${backend_url}/api/jobs/${jobId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
