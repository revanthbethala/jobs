import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Users } from "lucide-react";
import { RoundSelectionCard } from "./RoundSelectionCard";
import {
  getSpecificRoundResults,
  uploadRoundResults,
} from "@/services/roundServices";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useJobRoundsStore } from "@/store/jobRoundsStore";

export function StudentInputSection() {
  const { selectedRound, rounds, setSelectedRound } =
    useJobRoundsStore();

  const [commonUsername, setCommonUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { jobId } = useParams();

  const handleAddStudents = async () => {
    const username = commonUsername.trim();
    if (!username || !selectedRound || !jobId) return;

    const round = rounds.find((r) => r.roundNumber === selectedRound);
    if (!round) return;

    const usernames = username
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const data = {
      jobId,
      users: usernames,
      status: "Qualified",
      roundName: round.roundName,
    };

    try {
      setIsLoading(true);
      const res = await uploadRoundResults(data);

      const skippedUsers = res?.data?.skippedUsers || [];

      if (skippedUsers.length > 0) {
        toast({
          title: "Some users not found",
          description: `${skippedUsers.length} users were skipped`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Round results updated successfully",
        });
        await getSpecificRoundResults(jobId, round.roundName);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Upload Failed",
        description: "An error occurred while updating results.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

    setCommonUsername("");
  };

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Add Eligible Students
        </CardTitle>
        <CardDescription>
          Select a round and enter usernames (comma-separated)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Round Selection Cards */}

        <div className="space-y-2">
          <Label htmlFor="common-username">Enter Usernames</Label>
          <div className="flex lg:flex-row flex-col gap-2 lg:items-center justify-center">
            <Textarea
              id="common-username"
              placeholder="Enter usernames (comma-separated): user1, user2, user3"
              value={commonUsername}
              onChange={(e) => setCommonUsername(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              onClick={handleAddStudents}
              disabled={!selectedRound || isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <span className="flex gap-1 items-center">
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </span>
              ) : (
                <span className="flex gap-1 items-center">
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Selected Round
                </span>
              )}
            </Button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {rounds?.map((round, index) => {
            return (
              <RoundSelectionCard
                key={round.id}
                round={round}
                index={index}
                isSelected={selectedRound === round.roundNumber}
                onSelect={setSelectedRound}
              />
            );
          })}
        </div>
        {selectedRound && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Selected round:
            </span>
            <Badge variant="secondary" className="capitalize">
              {rounds.find((r) => r.roundNumber === selectedRound)?.roundName}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
