import { create } from "zustand";

export interface Student {
  id: string;
  username: string;
}

export interface Round {
  roundNumber: number;
  id: string;
  roundName: string;
  description: string;
}

interface JobRoundsState {
  selectedRound: number | null;
  activeRoundTab: string;
  rounds: Round[]; // <-- Store all rounds here
  students: Record<number, Student[]>;

  // Setters
  setSelectedRound: (roundId: number) => void;
  setActiveRoundTab: (tab: string) => void;
  setRounds: (rounds: Round[]) => void;

  // (Optional for later use)
}

export const useJobRoundsStore = create<JobRoundsState>((set) => ({
  selectedRound: 1,
  activeRoundTab: "1",
  rounds: [],
  students: {},

  setSelectedRound: (roundId) => {
    set({
      selectedRound: roundId,
      activeRoundTab: roundId.toString(),
    });
  },

  setActiveRoundTab: (tab) => {
    set({
      activeRoundTab: tab,
      selectedRound: Number.parseInt(tab),
    });
  },

  setRounds: (rounds: Round[]) => {
    set({ rounds });
  },
}));
