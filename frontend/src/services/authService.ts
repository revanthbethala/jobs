import { LoginFormData, OtpFormData, SignupFormData } from "@/schemas/authSchema";
import axios from "axios";

const backend_url = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const userLogin = async (userDetails: LoginFormData) => {
  try {
    const res = await axios.post(`${backend_url}/users/login`, userDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userSignUp = async (userDetails: SignupFormData) => {
  try {
    const res = await axios.post(`${backend_url}/users/signup`, userDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const otpVerification = async(otp:OtpFormData) =>{
  try{
    const res = await axios.post(`${backend_url}/users/verify-email`,
      otp,{
        headers:{
          "Content-Type": "application/json",
        }
    }
    )
    return res
  }

  catch(error) {
    console.log(error);
    throw error
  }
}

export const adminLogin = async (userDetails: LoginFormData) => {
  try {
    const res = await axios.post(`${backend_url}/login`,userDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
