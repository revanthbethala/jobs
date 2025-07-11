import { create } from "zustand";
import { ProfileData } from "@/services/profileServices";

interface ProfileStore {
  profile: ProfileData | null;
  isLoading: boolean;
  isEditing: boolean;
  editedProfile: Partial<ProfileData>;
  isSaving: boolean;

  // Actions
  setProfile: (profile: ProfileData) => void;
  setLoading: (loading: boolean) => void;
  setEditing: (editing: boolean) => void;
  setEditedProfile: (profile: Partial<ProfileData>) => void;
  setSaving: (saving: boolean) => void;
  updateField: (field: string, value: any) => void;
  resetEditedProfile: () => void;
  getDisplayProfile: () => ProfileData | null;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  isLoading: false,
  isEditing: false,
  editedProfile: {},
  isSaving: false,

  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setEditing: (isEditing) => set({ isEditing }),
  setEditedProfile: (editedProfile) => set({ editedProfile }),
  setSaving: (isSaving) => set({ isSaving }),

  updateField: (field, value) =>
    set((state) => ({
      editedProfile: { ...state.editedProfile, [field]: value },
    })),

  resetEditedProfile: () => set({ editedProfile: {} }),

  getDisplayProfile: () => {
    const { profile, editedProfile, isEditing } = get();
    console.log("Profile in store", profile);
    const userData = profile?.user;
    console.log(userData);
    if (!userData) return null;
    return isEditing ? { ...userData, ...editedProfile } : userData;
  },
}));
