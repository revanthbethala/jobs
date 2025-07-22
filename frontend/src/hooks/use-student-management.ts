"use client"

import { useState } from "react"
import type { EligibleStudent, RoundState } from "./use-job-rounds"

export function useStudentManagement() {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [moveToRound, setMoveToRound] = useState<string>("")

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(studentId)) {
        newSet.delete(studentId)
      } else {
        newSet.add(studentId)
      }
      return newSet
    })
  }

  const selectAllStudents = (students: EligibleStudent[]) => {
    const allStudentIds = students.map((s) => s.id)
    setSelectedStudents(new Set(allStudentIds))
  }

  const deselectAllStudents = () => {
    setSelectedStudents(new Set())
  }

  const deleteSelectedStudents = (
    currentRoundId: number,
    currentState: RoundState,
    updateRoundState: (roundId: number, updates: Partial<RoundState>) => void,
  ) => {
    updateRoundState(currentRoundId, {
      eligibleStudents: currentState.eligibleStudents.filter((s) => !selectedStudents.has(s.id)),
    })
    setSelectedStudents(new Set())
  }

  const moveSelectedStudents = (
    fromRoundId: number,
    fromState: RoundState,
    toState: RoundState,
    updateRoundState: (roundId: number, updates: Partial<RoundState>) => void,
  ) => {
    if (!moveToRound || selectedStudents.size === 0) return

    const toRoundId = Number.parseInt(moveToRound)
    if (fromRoundId === toRoundId) return

    // Get students to move
    const studentsToMove = fromState.eligibleStudents.filter((s) => selectedStudents.has(s.id))

    // Remove from source round
    updateRoundState(fromRoundId, {
      eligibleStudents: fromState.eligibleStudents.filter((s) => !selectedStudents.has(s.id)),
    })

    // Add to destination round (check for duplicates)
    const existingUsernames = toState.eligibleStudents.map((s) => s.username)
    const uniqueStudents = studentsToMove.filter((s) => !existingUsernames.includes(s.username))

    // Create new IDs for moved students
    const movedStudents = uniqueStudents.map((s) => ({
      ...s,
      id: `${toRoundId}-${s.username}-${Date.now()}-${Math.random()}`,
    }))

    updateRoundState(toRoundId, {
      eligibleStudents: [...toState.eligibleStudents, ...movedStudents],
    })

    setSelectedStudents(new Set())
    setMoveToRound("")
  }

  return {
    selectedStudents,
    moveToRound,
    setMoveToRound,
    toggleStudentSelection,
    selectAllStudents,
    deselectAllStudents,
    deleteSelectedStudents,
    moveSelectedStudents,
  }
}
