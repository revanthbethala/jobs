// store/profileStore.ts
import { create } from "zustand";
import { PersonalInfo, Education } from "@/types/profileTypes";
import { QueryClient } from "@tanstack/react-query";
import { getProfile } from "@/services/profileService";

interface FormStore {
  currentStep: number;
  tempPersonalInfo: Partial<PersonalInfo>;
  tempEducation: Education[];
  tempResume: File | null;

  // Actions
  setCurrentStep: (step: number) => void;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateEducation: (education: Education[]) => void;
  addEducation: (education: Education) => void;
  removeEducation: (id: string) => void;
  updateEducationEntry: (id: string, data: Partial<Education>) => void;
  setResume: (file: File | null) => void;
  resetForm: () => void;

  // ✅ TanStack query-backed action
  getProfileFromAPI: () => Promise<void>;
}

export const useProfileStore = create<FormStore>((set, get) => ({
  currentStep: 1,
  tempPersonalInfo: {
    username: "revanthbethala",
    collegeId: "22kn1a4405",
    email: "revanthbethala@gmail.com",
    gender: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    fatherName: "",
    motherName: "",
    city: "",
    state: "",
    country: "",
    profilePic: null,
    role: "USER",
  },
  tempEducation: [],
  tempResume: null,

  setCurrentStep: (step) => set({ currentStep: step }),

  updatePersonalInfo: (data) =>
    set((state) => {
      const newPersonalInfo = { ...state.tempPersonalInfo };

      Object.keys(data).forEach((key) => {
        const value = data[key as keyof PersonalInfo];
        if (key === "profilePic" && value instanceof File) {
          newPersonalInfo.profilePic = value;
        } else {
          newPersonalInfo[key] = value;
        }
      });

      return { tempPersonalInfo: newPersonalInfo };
    }),

  updateEducation: (education) => set({ tempEducation: education }),

  addEducation: (education) =>
    set((state) => ({
      tempEducation: [...state.tempEducation, education],
    })),

  removeEducation: (id) =>
    set((state) => ({
      tempEducation: state.tempEducation.filter((edu) => edu.id !== id),
    })),

  updateEducationEntry: (id, data) =>
    set((state) => ({
      tempEducation: state.tempEducation.map((edu) =>
        edu.id === id ? { ...edu, ...data } : edu
      ),
    })),

  setResume: (file) => set({ tempResume: file }),

  resetForm: () =>
    set({
      currentStep: 1,
      tempPersonalInfo: {
        username: "",
        collegeId: "",
        email: "",
        gender: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phoneNumber: "",
        address: "",
        fatherName: "",
        motherName: "",
        city: "",
        state: "",
        country: "",
        profilePic: null,
        role: "USER",
      },
      tempEducation: [],
      tempResume: null,
    }),

  // ✅ Call API and update store
  getProfileFromAPI: async () => {
    try {
      const data = await getProfile();
      const profileData = data?.user;
      console.log("Fetched profile:", profileData);

      const { personalInfo, education } = profileData;

      if (personalInfo) {
        set({ tempPersonalInfo: personalInfo });
      }

      if (education) {
        set({ tempEducation: education });
      }

      // Note: resume can't be serialized if it's a File
    } catch (err) {
      console.error("Error getting profile from API:", err);
    }
  },
}));
