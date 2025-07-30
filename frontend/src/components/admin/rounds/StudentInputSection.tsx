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
import { Loader2, Plus, Users, Upload } from "lucide-react";
import { RoundSelectionCard } from "./RoundSelectionCard";
import {
  getSpecificRoundResults,
  uploadRoundResults,
} from "@/services/roundServices";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useJobRoundsStore } from "@/store/jobRoundsStore";
import * as XLSX from "xlsx";

export function StudentInputSection() {
  const { selectedRound, rounds, setSelectedRound } = useJobRoundsStore();

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

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);

      // Normalize and match columns
      const acceptedKeys = [
        "username",
        "usernames",
        "rollnum",
        "rollno",
        "rollnumber",
        "rollnumbers",
        "rollnos",
      ];

      const normalize = (str: string) =>
        str.toLowerCase().replace(/\s+|\./g, "");

      const usernames: string[] = [];

      data.forEach((row) => {
        Object.entries(row).forEach(([key, value]) => {
          if (
            typeof value === "string" &&
            acceptedKeys.includes(normalize(key))
          ) {
            usernames.push(value.trim());
          }
        });
      });

      if (usernames.length === 0) {
        toast({
          title: "No valid usernames",
          description:
            "No valid 'username' or 'roll number' columns found in Excel.",
          variant: "destructive",
        });
        return;
      }

      setCommonUsername(usernames.join(", "));
      toast({
        title: "Excel Loaded",
        description: `${usernames.length} usernames loaded from Excel.`,
      });
    };
  };

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Add Eligible Students
        </CardTitle>
        <CardDescription>
          Select a round and enter usernames manually or via Excel upload.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
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

          <div className="space-y-2 flex flex-col justify-center items-center ">
            <Label className="text-sm font-medium text-gray-700">
              Or Upload via Excel File
            </Label>
            <div className="flex items-center gap-4">
              <div className="relative space-y-4">
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  Choose Excel File
                </Button>
                <span className="text-sm text-gray-500">
                  Supported formats: .xlsx, .xls
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {rounds?.map((round, index) => (
            <RoundSelectionCard
              key={round.id}
              round={round}
              index={index}
              isSelected={selectedRound === round.roundNumber}
              onSelect={setSelectedRound}
            />
          ))}
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
