// "use client";

// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import { getJobById } from "@/services/jobServices";

// export interface EligibleStudent {
//   id: string;
//   username: string;
// }

// export interface RoundState {
//   eligibleStudents: EligibleStudent[];
// }

// export function useJobRounds() {
//   const { jobId } = useParams();
//   const [roundStates, setRoundStates] = useState<Record<number, RoundState>>(
//     {}
//   );
//   const [selectedRound, setSelectedRound] = useState<number | null>(null);
//   const [activeRoundTab, setActiveRoundTab] = useState<string>("1");

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["jobDetails", jobId],
//     queryFn: () => getJobById(jobId as string),
//     enabled: !!jobId,
//   });
//   const rounds = data?.rounds || [];

//   // ✅ Initialize roundStates from backend data only once
//   // useEffect(() => {
//   //   if (data?.rounds?.length && Object.keys(roundStates).length === 0) {
//   //     const initialStates: Record<number, RoundState> = {};
//   //     for (const round of data.rounds) {
//   //       initialStates[round.roundNumber] = {
//   //         eligibleStudents: round.eligibleStudents || [],
//   //       };
//   //     }
//   //     setRoundStates(initialStates);
//   //   }
//   // }, [data, roundStates]);

//   const getRoundState = (roundId: number): RoundState => {
//     return roundStates[roundId] || { eligibleStudents: [] };
//   };

//   const updateRoundState = (roundId: number, updates: Partial<RoundState>) => {
//     setRoundStates((prev) => ({
//       ...prev,
//       [roundId]: {
//         ...getRoundState(roundId),
//         ...updates,
//       },
//     }));
//   };

//   const selectRound = (roundId: number) => {
//     setSelectedRound(roundId);
//     setActiveRoundTab(roundId.toString());
//   };

//   const handleTabChange = (value: string) => {
//     setActiveRoundTab(value);
//     setSelectedRound(Number.parseInt(value));
//   };

//   return {
//     data,
//     isLoading,
//     error,
//     rounds,
//     roundStates,
//     selectedRound,
//     activeRoundTab,
//     getRoundState,
//     updateRoundState,
//     selectRound,
//     handleTabChange,
//   };
// }
