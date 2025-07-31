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
  role: string | null;
  setUserType: (type: UserType) => void;
  setCurrentStep: (step: AuthStep) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  setAuthenticated: (status: boolean) => void;
  setLoggedIn: (status: boolean) => void;
  setUserId: (userId: string) => void;
  setRole: (role: string) => void;
  loginToken: (token: string, role: string) => void;
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
  token: storedToken,
  isAuthenticated: !!storedToken,
  isLoggedIn: !!storedToken,
  userId: "",
  role: storedRole,

  setUserType: (type) => set({ userType: type }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setEmail: (email) => set({ email }),
  setUsername: (username) => set({ username }),
  setToken: (token) => set({ token }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserId: (userId) => set({ userId }),
  setRole: (role) => set({ role }),
  loginToken: (token, role) => {
    const expiresInDays = 1;
    Cookies.set("token", token, { expires: expiresInDays });
    Cookies.set("role", role, { expires: expiresInDays });
    set({
      token,
      isLoggedIn: true,
      isAuthenticated: true,
      role: role,
    });
  },

  logOut: () => {
    Cookies.remove("token");
    Cookies.remove("role");
    set({
      token: "",
      isLoggedIn: false,
      isAuthenticated: false,
      email: "",
      username: "",
      role: "",
    });
  },

  reset: () =>
    set({
      userType: "user",
      currentStep: "login",
      email: "",
      username: "",
      token: "",
      role: "",
      isAuthenticated: false,
      isLoggedIn: false,
      userId: null,
    }),
}));
