import { create } from "zustand";
import Cookies from "js-cookie";

export type UserType = "user" | "admin";
export type AuthStep =
  | "login"
  | "signup"
  | "otp"
  | "forgot-password"
  | "reset-password";

interface AuthState {
  userType: UserType;
  currentStep: AuthStep;
  email: string;
  username: string;
  token: string;
  isAuthenticated: boolean;
  isLoggedIn: boolean;

  setUserType: (type: UserType) => void;
  setCurrentStep: (step: AuthStep) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  setAuthenticated: (status: boolean) => void;
  setLoggedIn: (status: boolean) => void;

  loginToken: (token: string) => void;
  logOut: () => void;

  reset: () => void;
}

// Initialize from cookie if exists
const storedToken = Cookies.get("token") || "";

export const useAuthStore = create<AuthState>((set) => ({
  userType: "user",
  currentStep: "login",
  email: "",
  username: "",
  token: storedToken,
  isAuthenticated: !!storedToken,
  isLoggedIn: !!storedToken,

  setUserType: (type) => set({ userType: type }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setEmail: (email) => set({ email }),
  setUsername: (username) => set({ username }),
  setToken: (token) => set({ token }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  loginToken: (token: string) => {
    Cookies.set("token", token);
    set({
      token,
      isLoggedIn: true,
      isAuthenticated: true,
    });
  },

  logOut: () => {
    Cookies.remove("token");
    set({
      token: "",
      isLoggedIn: false,
      isAuthenticated: false,
      email: "",
      username: "",
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
    }),
}));
