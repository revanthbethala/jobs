"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Save,
  Trash2,
  Users,
  Move,
  CheckSquare,
  Square,
  ArrowRight,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getJobById } from "@/services/jobServices";

interface EligibleStudent {
  id: string;
  username: string;
}

interface RoundState {
  eligibleStudents: EligibleStudent[];
}

export default function JobRounds() {
  const { jobId } = useParams();
  const [roundStates, setRoundStates] = useState<Record<number, RoundState>>(
    {}
  );
  const [commonUsername, setCommonUsername] = useState("");
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [activeRoundTab, setActiveRoundTab] = useState<string>("1");
  const [moveToRound, setMoveToRound] = useState<string>("");
  const [showBulkActions, setShowBulkActions] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: () => getJobById(jobId as string),
    enabled: !!jobId,
  });

  const rounds = data?.rounds || [];
  console.log(rounds);
  const getRoundState = (roundId: number): RoundState => {
    return (
      roundStates[roundId] || {
        eligibleStudents: [],
      }
    );
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

  const selectRound = (roundId: number) => {
    setSelectedRound(roundId);
    setActiveRoundTab(roundId.toString());
  };

  const addStudentsToSelectedRound = () => {
    const username = commonUsername.trim();
    if (!username || !selectedRound) return;

    // Handle comma-separated usernames
    const usernames = username
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u);

    const currentState = getRoundState(selectedRound);
    const newStudents: EligibleStudent[] = usernames.map((u) => ({
      id: `${selectedRound}-${u}-${Date.now()}-${Math.random()}`,
      username: u,
    }));

    // Check for duplicates
    const existingUsernames = currentState.eligibleStudents.map(
      (s) => s.username
    );
    const uniqueNewStudents = newStudents.filter(
      (s) => !existingUsernames.includes(s.username)
    );

    updateRoundState(selectedRound, {
      eligibleStudents: [
        ...currentState.eligibleStudents,
        ...uniqueNewStudents,
      ],
    });

    setCommonUsername("");
  };

  const removeStudent = (roundId: number, studentId: string) => {
    const currentState = getRoundState(roundId);
    updateRoundState(roundId, {
      eligibleStudents: currentState.eligibleStudents.filter(
        (s) => s.id !== studentId
      ),
    });
  };

  const updateEligibleStudents = async (roundId: number) => {
    const currentState = getRoundState(roundId);
    console.log(
      `Updating eligible students for round ${roundId}:`,
      currentState.eligibleStudents
    );

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(
      `Successfully updated ${currentState.eligibleStudents.length} eligible students for round ${roundId}`
    );
  };
console.log("Selected Students:", selectedStudents);
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const selectAllStudents = () => {
    const currentRoundId = Number.parseInt(activeRoundTab);
    const currentState = getRoundState(currentRoundId);
    const allStudentIds = currentState.eligibleStudents.map((s) => s.id);
    setSelectedStudents(new Set(allStudentIds));
  };

  const deselectAllStudents = () => {
    setSelectedStudents(new Set());
  };

  const deleteSelectedStudents = () => {
    const currentRoundId = Number.parseInt(activeRoundTab);
    const currentState = getRoundState(currentRoundId);

    updateRoundState(currentRoundId, {
      eligibleStudents: currentState.eligibleStudents.filter(
        (s) => !selectedStudents.has(s.id)
      ),
    });

    setSelectedStudents(new Set());
  };

  const moveSelectedStudents = () => {
    if (!moveToRound || selectedStudents.size === 0) return;

    const fromRoundId = Number.parseInt(activeRoundTab);
    const toRoundId = Number.parseInt(moveToRound);

    if (fromRoundId === toRoundId) return;

    const fromState = getRoundState(fromRoundId);
    const toState = getRoundState(toRoundId);

    // Get students to move
    const studentsToMove = fromState.eligibleStudents.filter((s) =>
      selectedStudents.has(s.id)
    );

    // Remove from source round
    updateRoundState(fromRoundId, {
      eligibleStudents: fromState.eligibleStudents.filter(
        (s) => !selectedStudents.has(s.id)
      ),
    });

    // Add to destination round (check for duplicates)
    const existingUsernames = toState.eligibleStudents.map((s) => s.username);
    const uniqueStudents = studentsToMove.filter(
      (s) => !existingUsernames.includes(s.username)
    );

    // Create new IDs for moved students
    const movedStudents = uniqueStudents.map((s) => ({
      ...s,
      id: `${toRoundId}-${s.username}-${Date.now()}-${Math.random()}`,
    }));

    updateRoundState(toRoundId, {
      eligibleStudents: [...toState.eligibleStudents, ...movedStudents],
    });

    setSelectedStudents(new Set());
    setMoveToRound("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading job rounds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Error loading job details. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentRoundId = Number.parseInt(activeRoundTab);
  const currentRoundState = getRoundState(currentRoundId);
  const currentRound = rounds.find((r) => r.id === currentRoundId);

  const handleTabChange = (value: string) => {
    setActiveRoundTab(value);
    setSelectedRound(Number.parseInt(value));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Interview Rounds</h1>
        <p className="text-muted-foreground">
          {data?.title && `for ${data.title}`}
        </p>
      </div>

      {/* Common Input Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Add Eligible Students
          </CardTitle>
          <CardDescription>
            Select a round and enter GitHub usernames to add eligible students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="common-username">GitHub Usernames</Label>
            <div className="flex gap-2">
              <Textarea
                id="common-username"
                placeholder="Enter usernames (comma-separated): user1, user2, user3"
                value={commonUsername}
                onChange={(e) => setCommonUsername(e.target.value)}
                className="min-h-[80px]"
              />
              <Button
                onClick={addStudentsToSelectedRound}
                disabled={!commonUsername.trim() || !selectedRound}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Selected Round
              </Button>
            </div>
          </div>

          {/* Round Selection Cards */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {rounds.map((round, index) => {
              const roundState = getRoundState(round.id);
              const isSelected = selectedRound === round.id;
              console.log(round);
              return (
                <Card
                  key={round.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRound === round.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => selectRound(round.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        Round {index + 1}
                      </Badge>
                      {selectedRound === round.id && (
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1 capitalize">
                      {round.roundName} Round
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {/* <Users className="h-3 w-3" />
                      {roundState.eligibleStudents.length} students */}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedRound && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Selected round:
              </span>
              <Badge variant="secondary" className="capitalize">
                {rounds.find((r) => r.id === selectedRound)?.roundName}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unified Student Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Management
              </CardTitle>
              <CardDescription>
                View and manage eligible students for each round
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Bulk Actions
              {showBulkActions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Round Tabs */}
          <Tabs value={activeRoundTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              {rounds.map((round, index) => {
                const roundState = getRoundState(round.id);
                return (
                  <TabsTrigger
                    key={round.id}
                    value={round.id.toString()}
                    className="text-xs"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>Round {index + 1}</span>
                      {/* <span>{round?.roundName}</span> */}
                      <Badge variant="secondary" className="text-xs">
                        {roundState.eligibleStudents.length}
                      </Badge>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {rounds.map((round) => (
              <TabsContent
                key={round.id}
                value={round.id.toString()}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{round.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {round.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getRoundState(round.id).eligibleStudents.length} students
                    </Badge>
                    <Button
                      onClick={() => updateEligibleStudents(round.id)}
                      disabled={
                        getRoundState(round.id).eligibleStudents.length === 0
                      }
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {showBulkActions && (
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={selectAllStudents}
                            disabled={
                              currentRoundState.eligibleStudents.length === 0
                            }
                          >
                            <CheckSquare className="h-4 w-4 mr-1" />
                            Select All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={deselectAllStudents}
                            disabled={selectedStudents.size === 0}
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Deselect All
                          </Button>
                        </div>

                        {selectedStudents.size > 0 && (
                          <>
                            <div className="flex items-center gap-2">
                              <Select
                                value={moveToRound}
                                onValueChange={setMoveToRound}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Move to..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {rounds
                                    .filter((r) => r.id !== currentRoundId)
                                    .map((round, index) => (
                                      <SelectItem
                                        key={round.id}
                                        value={round.id.toString()}
                                      >
                                        Round{" "}
                                        {rounds.findIndex(
                                          (r) => r.id === round.id
                                        ) + 1}
                                        : {round.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <Button
                                onClick={moveSelectedStudents}
                                disabled={!moveToRound}
                                size="sm"
                              >
                                <ArrowRight className="h-4 w-4 mr-1" />
                                Move ({selectedStudents.size})
                              </Button>
                            </div>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={deleteSelectedStudents}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete ({selectedStudents.size})
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Students Table */}
                {currentRoundState.eligibleStudents.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                currentRoundState.eligibleStudents.length > 0 &&
                                currentRoundState.eligibleStudents.every((s) =>
                                  selectedStudents.has(s.id)
                                )
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  selectAllStudents();
                                } else {
                                  deselectAllStudents();
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentRoundState.eligibleStudents.map(
                          (student, idx) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedStudents.has(student.id)}
                                  onCheckedChange={() =>
                                    toggleStudentSelection(student.id)
                                  }
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {idx + 1}
                              </TableCell>
                              <TableCell className="font-mono">
                                @{student.username}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeStudent(currentRoundId, student.id)
                                  }
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No eligible students added yet</p>
                    <p className="text-sm">
                      Use the form above to add students to this round
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {rounds.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              No interview rounds found for this job.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}