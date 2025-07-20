import { Education, PersonalInfo } from "@/types/profileTypes";
import { create } from "zustand";

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
}

// Create store WITHOUT persistence to avoid File serialization issues
export const useProfileStore = create<FormStore>((set, get) => ({
  currentStep: 1,
  tempPersonalInfo: {
    username: "john_doe",
    collegeId: "COL123456",
    email: "john.doe@example.com",
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

  // Fixed updatePersonalInfo to handle File objects properly
  updatePersonalInfo: (data) =>
    set((state) => {
      const newPersonalInfo = { ...state.tempPersonalInfo };

      // Handle each property individually to preserve File objects
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof PersonalInfo];
        if (key === "profilePic" && value instanceof File) {
          // Preserve File object directly
          newPersonalInfo.profilePic = value;
        } else {
          // Handle other properties normally
          (newPersonalInfo )[key] = value;
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

  // Simple setter for resume file
  setResume: (file) => set({ tempResume: file }),

  resetForm: () =>
    set({
      currentStep: 1,
      tempPersonalInfo: {
        username: "john_doe",
        collegeId: "COL123456",
        email: "john.doe@example.com",
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
}));
