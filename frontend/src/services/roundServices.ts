import { useAuthStore } from "@/store/authStore";
import axios from "axios";
const backend_url = `${import.meta.env.VITE_BACKEND_URL}/api/rounds`;
const token = useAuthStore.getState().token;
export const uploadRoundResults = async (data) => {
  try {
    const res = axios.post(`${backend_url}/upload`, data, {
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
    const res = axios.get(`${backend_url}/results/${jobId}/${roundName}`, {
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

export const deleteRound = async (roundId: string | undefined) => {
  try {
    const res = axios.delete(`${backend_url}/${roundId}`, {
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
export const deleteUserInRound = async (jobId, roundName, usernames) => {
  try {
    const res = axios.delete(
      `${backend_url}/results/${jobId}/${roundName}/users`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: usernames
      }
    );
    return (await res).data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUserRoundResults = async () => {
  try {
    const res = axios.get(`${backend_url}/api/rounds/user`, {
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
