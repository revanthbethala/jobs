export interface Round {
  id: number;
  roundName: string;
  name: string;
  description: string;
}
export interface RoundState {
  eligibleStudents: EligibleStudent[];
}

// types.ts
export interface EligibleStudent {
  id: string;
  username: string;
}
