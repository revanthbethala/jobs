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
