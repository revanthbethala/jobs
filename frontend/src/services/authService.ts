import {
  ForgotPasswordFormData,
  LoginFormData,
  OtpFormData,
  ResetPasswordFormData,
  SignupFormData,
} from "@/schemas/authSchema";
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
type otpDetailsType = {
  email: string;
  otp: number;
};

export const otpVerification = async (otpDetails: otpDetailsType) => {
  try {
    const res = await axios.post(
      `${backend_url}/users/verify-email`,
      otpDetails,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.status;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const requestOtp = async (data: ForgotPasswordFormData) => {
  try {
    const res = await axios.post(
      `${backend_url}/users/request-password-otp`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.status;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resetPasswordService = async (data: ResetPasswordFormData) => {
  try {
    const res = await axios.post(
      `${backend_url}/users/reset-password`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.log("");
    throw error;
  }
};


export const adminLogin = async (userDetails: LoginFormData) => {
  try {
    const res = await axios.post(`${backend_url}/login`, userDetails, {
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
