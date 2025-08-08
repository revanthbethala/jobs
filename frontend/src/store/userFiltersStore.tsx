import { create } from "zustand";

interface EducationLevelFilter {
  level: string;
  percentageRange: [number, number];
  specialization: string[];
}

interface UserFiltersState {
  search?: string;
  gender?: string;
  educationalLevels: EducationLevelFilter[];
  passedOutYears: number[];
  minActiveBacklogs?: number;
  maxActiveBacklogs?: number;
  page: number;
  limit: number;
  showAllData: boolean;
  setShowAllData: (showData: boolean) => void;
  setFilters: (filters: Partial<UserFiltersState>) => void;
  resetFilters: () => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useUserFiltersStore = create<UserFiltersState>((set) => ({
  // Initial values
  search: "",
  gender: undefined,
  educationalLevels: [],
  passedOutYears: [],
  minActiveBacklogs: undefined,
  maxActiveBacklogs: undefined,
  showAllData: false,
  page: 1,
  limit: 10,

  // Set multiple filters
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  setShowAllData: (showData) => set({ showAllData: showData }),
  // Reset all filters
  resetFilters: () =>
    set({
      search: "",
      gender: undefined,
      educationalLevels: [],
      passedOutYears: [],
      minActiveBacklogs: undefined,
      maxActiveBacklogs: undefined,
      page: 1,
      limit: 10,
    }),

  // Setters for pagination
  setPage: (page) => set(() => ({ page })),
  setLimit: (limit) => set(() => ({ limit })),
}));
