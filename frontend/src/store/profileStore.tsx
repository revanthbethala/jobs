import { create } from "zustand";
import { PersonalInfo, Education } from "@/types/profileTypes";
import { getProfile } from "@/services/profileService";

interface FormStore {
  currentStep: number;
  tempPersonalInfo: Partial<PersonalInfo>;
  tempEducation: Education[];
  tempResume: File | null;
  profileUrl: string | null; // URL of the profile picture
  resumeUrl: string | null; // URL of the resume file
  setResume: (file: File | null) => void;

  // Hydration
  isHydrated: boolean;
  hydrateProfile: () => Promise<void>;

  // Actions
  setCurrentStep: (step: number) => void;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateEducation: (education: Education[]) => void;
  // updateResume: (resumeUrl: string) => void;
}

export const useProfileStore = create<FormStore>()((set) => ({
  currentStep: 0,
  tempPersonalInfo: {},
  tempEducation: [],
  tempResume: null,
  isHydrated: false,
  profileUrl: null,
  resumeUrl: null,
  setResume: (file) => set({ tempResume: file }),

  setCurrentStep: (step) => set({ currentStep: step }),

  updatePersonalInfo: (data) =>
    set((state) => ({
      tempPersonalInfo: { ...state.tempPersonalInfo, ...data },
    })),

  updateEducation: (education) => set({ tempEducation: education }),

  // updateResume: (resumeUrl) => set({ resumeUrl: resumeUrl }),

  hydrateProfile: async () => {
    try {
      const res = await getProfile(); // update endpoint if needed
      const profile = res.user;
      console.log("Profile data:", profile);
      set({
        tempPersonalInfo: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          username: profile.username,
          phoneNumber: profile.phoneNumber,
          dateOfBirth: profile.dateOfBirth
            ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: profile.gender,
          fatherName: profile.fatherName,
          motherName: profile.motherName,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          collegeId: profile.collegeId,
        },
        profileUrl: profile.profilePic, // string url
        tempEducation: profile.education || [],
        resumeUrl: profile.resume || null, // string url
        isHydrated: true,
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  },
}));
