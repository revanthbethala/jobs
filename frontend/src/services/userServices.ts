import { useAuthStore } from "@/store/authStore";
import axios from "axios";

import {
  ForgotPasswordFormData,
  LoginFormData,
  ResetPasswordFormData,
  SignupFormData,
} from "@/schemas/authSchema";

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
  otp: string;
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
    const res = await axios.post(`${backend_url}/users/reset-password`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
export const getPaginatedUsers = async (page = 1, limit = 10, filters = {}) => {
  const token = useAuthStore.getState().token;
  try {
    const res = await axios.post(
      `${backend_url}/users?page=${page}&limit=${limit}`,
      filters,
      {
        headers: {
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

export const getAdminDashboard = async () => {
  const token = useAuthStore.getState().token;
  try {
    const { data } = await axios.get(`${backend_url}/users/userDashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
