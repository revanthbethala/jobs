// store/useUserFilterStore.ts

import { create } from "zustand";
import { FilterFormData } from "@/schemas/userFiltersSchema";

export interface User {
  id: string;
  username: string;
  email: string;
  gender: string;
  firstName: string;
  lastName: string;
  education: {
    id: string;
    userId: string;
    educationalLevel: string;
    institution: string;
    specialization: string | null;
    boardOrUniversity: string;
    percentage: number;
    passedOutYear: number;
    location: string;
    noOfActiveBacklogs: number;
  }[];
}

interface FilterState {
  filters: Partial<FilterFormData>;
  isFilterPanelOpen: boolean;
  users: User[];
  filteredUsers: User[];
  setFilters: (filters: Partial<FilterFormData>) => void;
  toggleFilterPanel: () => void;
  setUsers: (users: User[]) => void;
  clearFilters: () => void;
  removeFilter: (filterKey: keyof FilterFormData) => void;
}

export const useUserFilterStore = create<FilterState>((set, get) => ({
  filters: {},
  isFilterPanelOpen: false,
  users: [],
  filteredUsers: [],

  setFilters: (filters) => {
    const { users } = get();
    set({
      filters,
      filteredUsers: applyFilters(users, filters),
    });
  },

  toggleFilterPanel: () =>
    set((state) => ({
      isFilterPanelOpen: !state.isFilterPanelOpen,
    })),

  setUsers: (users) => {
    const { filters } = get();
    set({
      users,
      filteredUsers: applyFilters(users, filters),
    });
  },

  clearFilters: () => {
    const { users } = get();
    set({
      filters: {},
      filteredUsers: users,
    });
  },

  removeFilter: (filterKey) => {
    const { filters, users } = get();
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    set({
      filters: newFilters,
      filteredUsers: applyFilters(users, newFilters),
    });
  },
}));

function applyFilters(users: User[], filters: Partial<FilterFormData>): User[] {
  return users.filter((user) => {
    // 🔍 Search
    if (typeof filters.search === "string" && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase();
      const match =
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);
      if (!match) return false;
    }

    // 👤 Gender
    if (filters.gender && user.gender !== filters.gender) return false;
    if (
      filters.educationFilters &&
      Object.keys(filters.educationFilters).length > 0
    ) {
      const match = Object.entries(filters.educationFilters).some(
        ([level, { percentageRange }]) => {
          const eduMatch = user.education.find(
            (edu) =>
              percentageRange &&
              edu.educationalLevel === level &&
              edu.percentage >= percentageRange[0] &&
              edu.percentage <= percentageRange[1]
          );
          return !!eduMatch;
        }
      );
      if (!match) return false;
    }
    // 🎓 Passed Out Year
    if (filters.passedOutYears?.length) {
      const match = user.education.some((e) =>
        filters.passedOutYears!.includes(e.passedOutYear)
      );
      if (!match) return false;
    }

    // 🎒 Active Backlogs
    const totalBacklogs = user.education.reduce(
      (sum, edu) => sum + edu.noOfActiveBacklogs,
      0
    );

    if (
      filters.minActiveBacklogs !== undefined &&
      totalBacklogs < filters.minActiveBacklogs
    ) {
      return false;
    }

    if (
      filters.maxActiveBacklogs !== undefined &&
      totalBacklogs > filters.maxActiveBacklogs
    ) {
      return false;
    }

    return true;
  });
}
