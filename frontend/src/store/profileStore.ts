import { create } from "zustand";
import { toast } from "@/hooks/use-toast";
import { EducationItem, ProfileData } from "@/services/profileService";
import { getProfile, updateProfile } from "@/services/api";
import EducationSection from "@/components/profile/EducationSection";

const default_profile =
  "https://imgs.search.brave.com/xlfqxb13HWmf6vJkyEshElDmDh1XDri1WnVlTCuRYas/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWd2/My5mb3Rvci5jb20v/aW1hZ2VzL2dhbGxl/cnkvZ2VuZXJhdGUt/YS1jeWJlcnB1bmst/YWktYXZhdGFyLW9m/LWEtbWFsZS1pbi1m/b3Rvci5qcGc";

const default_resume =
  "https://imgs.search.brave.com/xlfqxb13HWmf6vJkyEshElDmDh1XDri1WnVlTCuRYas/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWd2/My5mb3Rvci5jb20v/aW1hZ2VzL2dhbGxl/cnkvZ2VuZXJhdGUt/YS1jeWJlcnB1bmst/YWktYXZhdGFyLW9m/LWEtbWFsZS1pbi1m/b3Rvci5qcGc";

interface ProfileState {
  profile: ProfileData | null;
  isLoading: boolean;
  isEditing: boolean;
  currentStep: number;
  profilePictureAnimationComplete: boolean;

  // Temporary staged data
  tempPersonalInfo: Partial<ProfileData>;
  tempEducation: EducationItem[];
  tempResume: string;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: () => Promise<void>; // Now uses temp values
  setEditing: (editing: boolean) => void;
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
  currentStep: 0,
  profilePictureAnimationComplete: false,

  tempPersonalInfo: {},
  tempEducation: [],
  tempResume: "",

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const profileData = await getProfile();
      console.log("Profile", profileData);
      const finalData = {
        ...profileData.user,
        // profilePicture: profileData.profilePicture || default_profile,
        // resume: profileData.resume,
      };
console.log("Final data",finalData);
      set({
        profile: finalData,
        tempPersonalInfo: finalData,
        tempEducation: finalData.education || [],
        tempResume: finalData.resume,
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
    console.log("updating data", finalUpdate);

    try {
      const updatedProfile = await updateProfile(finalUpdate);

      const withDefaults = {
        ...updatedProfile,
        profilePicture: updatedProfile.profilePicture || default_profile,
        resume: updatedProfile.resume || default_resume,
      };

      set({ profile: withDefaults, isLoading: false });
      toast({ title: "Success", description: "Profile updated successfully" });
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
  setCurrentStep: (step) => set({ currentStep: step }),
  setProfilePictureAnimationComplete: (complete) =>
    set({ profilePictureAnimationComplete: complete }),

  setTempPersonalInfo: (data) => set({ tempPersonalInfo: data }),
  setTempEducation: (data) => set({ tempEducation: data }),
  setTempResume: (resume) => set({ tempResume: resume }),
}));
