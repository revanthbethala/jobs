import { useState } from "react";
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

export function useRoundState() {
  const [roundStates, setRoundStates] = useState<Record<number, RoundState>>(
    {}
  );

  const getRoundState = (roundId: number): RoundState => {
    return roundStates[roundId] || { eligibleStudents: [] };
  };

  const updateRoundState = (roundId: number, updates: Partial<RoundState>) => {
    setRoundStates((prev) => ({
      ...prev,
      [roundId]: {
        ...getRoundState(roundId),
        ...updates,
      },
    }));
  };

  const addStudentsToRound = (roundId: number, usernames: string[]) => {
    const currentState = getRoundState(roundId);
    const newStudents: EligibleStudent[] = usernames.map((username) => ({
      id: `${roundId}-${username}-${Date.now()}-${Math.random()}`,
      username,
    }));

    const existingUsernames = currentState.eligibleStudents.map(
      (s) => s.username
    );
    const uniqueNewStudents = newStudents.filter(
      (s) => !existingUsernames.includes(s.username)
    );

    updateRoundState(roundId, {
      eligibleStudents: [
        ...currentState.eligibleStudents,
        ...uniqueNewStudents,
      ],
    });
  };

  const removeStudentFromRound = (roundId: number, studentId: string) => {
    const currentState = getRoundState(roundId);
    updateRoundState(roundId, {
      eligibleStudents: currentState.eligibleStudents.filter(
        (s) => s.id !== studentId
      ),
    });
  };

  const moveStudentsBetweenRounds = (
    fromRoundId: number,
    toRoundId: number,
    studentIds: Set<string>
  ) => {
    const fromState = getRoundState(fromRoundId);
    const toState = getRoundState(toRoundId);

    const studentsToMove = fromState.eligibleStudents.filter((s) =>
      studentIds.has(s.id)
    );

    // Remove from source round
    updateRoundState(fromRoundId, {
      eligibleStudents: fromState.eligibleStudents.filter(
        (s) => !studentIds.has(s.id)
      ),
    });

    // Add to destination round
    const existingUsernames = toState.eligibleStudents.map((s) => s.username);
    const uniqueStudents = studentsToMove.filter(
      (s) => !existingUsernames.includes(s.username)
    );

    const movedStudents = uniqueStudents.map((s) => ({
      ...s,
      id: `${toRoundId}-${s.username}-${Date.now()}-${Math.random()}`,
    }));

    updateRoundState(toRoundId, {
      eligibleStudents: [...toState.eligibleStudents, ...movedStudents],
    });
  };

  return {
    roundStates,
    getRoundState,
    updateRoundState,
    addStudentsToRound,
    removeStudentFromRound,
    moveStudentsBetweenRounds,
  };
}
