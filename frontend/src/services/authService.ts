import { loginInfo, userSignUpInfo } from "@/types/authTypes";
import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const userLogin = async (
  userDetails: loginInfo
): Promise<Response | Error | void> => {
  try {
    const res = await axios.post(`${backend_url}/`, {
      headers: {
        "Content-Type": "application/json",
        body: userDetails,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const userSignUp = async (
  userDetails: userSignUpInfo
): Promise<Response | Error> => {
  try {
    const res = await axios.post(`${backend_url}`, {
      headers: {
        "content-type": "application/json",
        body: userDetails,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const adminLogin = async (
  userDetails: loginInfo
): Promise<Response | Error | void> => {
  try {
    const res = await axios.post(`${backend_url}/`, {
      headers: {
        "Content-Type": "application/json",
        body: userDetails,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
