import { create } from "zustand";
import Cookies from "js-cookie";

export type UserType = "user" | "admin" | "superAdmin";
export type AuthStep =
  | "login"
  | "signup"
  | "otp"
  | "admin-signup"
  | "admin-accessKey"
  | "admin-login"
  | "login-email"
  | "forgot-password"
  | "reset-password";

interface AuthState {
  userType: UserType;
  currentStep: AuthStep;
  email: string;
  username: string;
  token: string;
  password: string;
  isLoggedIn: boolean;
  userId: string | null;
  role: string | null;
  setUserType: (type: UserType) => void;
  setCurrentStep: (step: AuthStep) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  setLoggedIn: (status: boolean) => void;
  setUserId: (userId: string) => void;
  setRole: (role: string) => void;
  loginToken: (
    token: string,
    role: string,
    email: string,
    username: string,
    userId: string
  ) => void;
  logOut: () => void;
  reset: () => void;
}

// Get token and userId from cookies
const storedToken = Cookies.get("token") || "";
const storedRole = Cookies.get("role") || null;

export const useAuthStore = create<AuthState>((set) => ({
  userType: "user",
  currentStep: "login",
  email: "",
  username: "",
  password: "",
  token: storedToken,
  isLoggedIn: !!storedToken,
  userId: "",
  role: storedRole,

  setUserType: (type) => set({ userType: type }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setEmail: (email) => set({ email }),
  setUsername: (username) => set({ username }),
  setToken: (token) => set({ token }),
  setPassword: (password) => set({ password }),
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserId: (userId) => set({ userId }),
  setRole: (role) => set({ role }),
  loginToken: (token, role, email, username, userId) => {
    const expiresInDays = 1;
    Cookies.set("token", token, { expires: expiresInDays });
    Cookies.set("role", role, { expires: expiresInDays });
    set({
      token,
      isLoggedIn: true,
      role: role,
      username: username,
      email: email,
      userId: userId,
    });
  },

  logOut: () => {
    Cookies.remove("token");
    Cookies.remove("role");
    set({
      token: "",
      isLoggedIn: false,
      email: "",
      username: "",
      userId: "",
      role: "",
    });
  },

  reset: () =>
    set({
      userType: "user",
      currentStep: "login",
      email: "",
      password: "",
      username: "",
      token: "",
      role: "",
      isLoggedIn: false,
      userId: null,
    }),
}));
