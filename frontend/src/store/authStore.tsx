import { create } from "zustand";
import Cookies from "js-cookie";

export type UserType = "user" | "admin";
export type AuthStep =
  | "login"
  | "signup"
  | "otp"
  | "login-email"
  | "forgot-password"
  | "reset-password";

// You can extend this based on actual backend response
export interface UserDetails {
  id: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;
  otp: string | null;
  otpExpiry: string | null;
  firstName: string | null;
  lastName: string | null;
  fatherName: string | null;
  motherName: string | null;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  profilePic: string | null;
  resume: string | null;
}
interface AuthState {
  userType: UserType;
  currentStep: AuthStep;
  email: string;
  username: string;
  token: string;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  userDetails: UserDetails | null;

  setUserType: (type: UserType) => void;
  setCurrentStep: (step: AuthStep) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  setAuthenticated: (status: boolean) => void;
  setLoggedIn: (status: boolean) => void;
  setUserDetails: (details: UserDetails) => void;

  loginToken: (token: string, userDetails: UserDetails) => void;
  logOut: () => void;
  reset: () => void;
}

// Get token from cookies
const storedToken = Cookies.get("token") || "";

export const useAuthStore = create<AuthState>((set) => ({
  userType: "user",
  currentStep: "login",
  email: "",
  username: "",
  token: storedToken,
  isAuthenticated: !!storedToken,
  isLoggedIn: !!storedToken,
  userDetails: null,

  setUserType: (type) => set({ userType: type }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setEmail: (email) => set({ email }),
  setUsername: (username) => set({ username }),
  setToken: (token) => set({ token }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserDetails: (details) => set({ userDetails: details }),

  loginToken: (token, userDetails) => {
    Cookies.set("token", token);
    Cookies.set("userId", userDetails.id);
    set({
      token,
      isLoggedIn: true,
      isAuthenticated: true,
      userDetails,
    });
  },

  logOut: () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    set({
      token: "",
      isLoggedIn: false,
      isAuthenticated: false,
      email: "",
      username: "",
      userDetails: null,
    });
  },

  reset: () =>
    set({
      userType: "user",
      currentStep: "login",
      email: "",
      username: "",
      token: "",
      isAuthenticated: false,
      isLoggedIn: false,
      userDetails: null,
    }),
}));
