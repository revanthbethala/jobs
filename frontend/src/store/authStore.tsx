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

interface AuthState {
  userType: UserType;
  currentStep: AuthStep;
  email: string;
  username: string;
  token: string;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  userId: string | null;

  setUserType: (type: UserType) => void;
  setCurrentStep: (step: AuthStep) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  setAuthenticated: (status: boolean) => void;
  setLoggedIn: (status: boolean) => void;
  setUserId: (userId: string) => void;

  loginToken: (token: string, userId: string) => void;
  logOut: () => void;
  reset: () => void;
}

// Get token and userId from cookies
const storedToken = Cookies.get("token") || "";
const storedUserId = Cookies.get("userId") || null;

export const useAuthStore = create<AuthState>((set) => ({
  userType: "user",
  currentStep: "login",
  email: "",
  username: "",
  token: storedToken,
  isAuthenticated: !!storedToken,
  isLoggedIn: !!storedToken,
  userId: storedUserId,

  setUserType: (type) => set({ userType: type }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setEmail: (email) => set({ email }),
  setUsername: (username) => set({ username }),
  setToken: (token) => set({ token }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserId: (userId) => set({ userId }),

  loginToken: (token, userId) => {
    Cookies.set("token", token);
    Cookies.set("userId", userId);
    set({
      token,
      isLoggedIn: true,
      isAuthenticated: true,
      userId,
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
      userId: null,
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
      userId: null,
    }),
}));
