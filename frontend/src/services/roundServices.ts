import { useAuthStore } from "@/store/authStore";
import axios from "axios";
const backend_url = import.meta.env.VITE_BACKEND_URL;
const token = useAuthStore.getState().token;
export const uploadRoundResults = async (data) => {
  try {
    const res = axios.post(`${backend_url}/api/rounds/upload`, data, {
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

export const getSpecificRoundResults = async (
  jobId: string,
  roundName: string
) => {
  try {
    const res = axios.get(
      `${backend_url}/api/rounds/results/${jobId}/${roundName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return (await res).data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteRound = async (roundId: string | undefined) => {
  try {
    const res = axios.delete(`${backend_url}/api/rounds/${roundId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return (await res).data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
