import { create } from "zustand";
import { toast } from "@/hooks/use-toast";
import { getProfile, updateProfile } from "@/services/api";
import { EducationItem, ProfileData } from "@/types/profileTypes";

const default_profile =
  "https://imgs.search.brave.com/xlfqxb13HWmf6vJkyEshElDmDh1XDri1WnVlTCuRYas/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWd2/My5mb3Rvci5jb20v/aW1hZ2VzL2dhbGxl/cnkvZ2VuZXJhdGUt/YS1jeWJlcnB1bmst/YWktYXZhdGFyLW9m/LWEtbWFsZS1pbi1m/b3Rvci5qcGc";

const default_resume =
  "https://imgs.search.brave.com/xlfqxb13HWmf6vJkyEshElDmDh1XDri1WnVlTCuRYas/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWd2/My5mb3Rvci5jb20v/aW1hZ2VzL2dhbGxl/cnkvZ2VuZXJhdGUt/YS1jeWJlcnB1bmst/YWktYXZhdGFyLW9m/LWEtbWFsZS1pbi1m/b3Rvci5qcGc";

interface ProfileState {
  profile: ProfileData | null;
  isLoading: boolean;
  isEditing: boolean;
  forceEditing: boolean;
  currentStep: number;
  profilePictureAnimationComplete: boolean;

  // Temp/staged values
  tempPersonalInfo: Partial<ProfileData>;
  tempEducation: EducationItem[];
  tempResume: string;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: () => Promise<void>;

  setEditing: (editing: boolean) => void;
  setForceEditing: (editing: boolean) => void;
  setCurrentStep: (step: number) => void;
  setProfilePictureAnimationComplete: (complete: boolean) => void;

  setTempPersonalInfo: (data: Partial<ProfileData>) => void;
  setTempEducation: (data: EducationItem[]) => void;
  setTempResume: (resume: string) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  isEditing: false,
  forceEditing: false,
  currentStep: 0,
  profilePictureAnimationComplete: false,

  tempPersonalInfo: {},
  tempEducation: [],
  tempResume: "",

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const profileData = await getProfile();
      const finalData = {
        ...profileData.user,
      };

      set({
        profile: finalData,
        tempPersonalInfo: finalData,
        tempEducation: finalData.education || [],
        tempResume: finalData.resume || default_resume,
        isLoading: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
      set({ isLoading: false });
    }
  },

  updateProfile: async () => {
    set({ isLoading: true });
    const { tempPersonalInfo, tempEducation, tempResume } = get();
    const { profilePicture, ...rest } = tempPersonalInfo;

    const finalUpdate: Partial<ProfileData> = {
      ...rest,
      profilePicture: default_profile,
      education: tempEducation,
      resume: tempResume,
    };

    try {
      const updatedProfile = await updateProfile(finalUpdate);

      const withDefaults = {
        ...updatedProfile,
        profilePicture: updatedProfile.profilePicture || default_profile,
        resume: updatedProfile.resume || default_resume,
      };

      set({
        profile: withDefaults,
        isLoading: false,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      set({ isLoading: false });
    }
  },

  setEditing: (editing) => set({ isEditing: editing }),
  setForceEditing: (editing) => set({ forceEditing: editing }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setProfilePictureAnimationComplete: (complete) =>
    set({ profilePictureAnimationComplete: complete }),
  setTempPersonalInfo: (data) => set({ tempPersonalInfo: data }),
  setTempEducation: (data) => set({ tempEducation: data }),
  setTempResume: (resume) => set({ tempResume: resume }),
}));
