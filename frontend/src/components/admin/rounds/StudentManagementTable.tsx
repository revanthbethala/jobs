import {
  deleteRound,
  deleteUserInRound,
  getSpecificRoundResults,
  getUserRoundResults,
} from "@/services/roundServices";
import { useJobRoundsStore } from "@/store/jobRoundsStore";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AxiosError } from "axios";
import { Loader2, Trash, Users, Users2 } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import useDebounce from "@/hooks/use-debounce";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

function StudentManagementTable() {
  const { jobId } = useParams();
  const { selectedRound, rounds } = useJobRoundsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, isDebouncing] = useDebounce(searchTerm, 500);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);

  const round = rounds?.find((r) => r.roundNumber === selectedRound);
  const roundName = round?.roundName;
  const roundId = round?.id;
  const isEnabled = !!jobId && !!roundName;
  const { showRoundData } = useJobRoundsStore();

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["round-details", jobId, roundName, showRoundData],
    queryFn: () => getSpecificRoundResults(jobId!, roundName!),
  });

  const handleExportToExcel = () => {
    const exportData = (data?.roundResults ?? []).map((result) => ({
      "Full Name": `${result.user.firstName} ${result.user.lastName}`,
      Username: result.user.username,
      Email: result.user.email,
      Gender: result.user.gender,
      Resume: import.meta.env.VITE_BACKEND_URL + result.user.resume,
      Status: result.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Round Results");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(dataBlob, `${roundName}-round-results.xlsx`);
  };

  const handleDelete = async (username: string | string[]) => {
    if (typeof username === "string") username = [username];

    try {
      setIsDeleting(true);
      await deleteUserInRound(jobId, roundName, username);
      toast({ title: "User deleted successfully" });
      setSelectedUsernames([]);
      refetch();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error occurred while deleting user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredResults = useMemo(() => {
    const results = data?.roundResults ?? [];
    return results.filter((result) =>
      result?.user?.username
        ?.toLowerCase()
        .includes(debouncedQuery?.toLowerCase())
    );
  }, [data, debouncedQuery]);

  if (!selectedRound || !roundName) {
    return <p className="text-muted">Select a round to view student data.</p>;
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-24 flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="text-xs font-medium">Loading Results...</span>
      </div>
    );

  if (isError || error) {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No students found for this round.</p>
          <p className="text-sm">
            Use the form above to add students to this round.
          </p>
        </div>
      );
    }
    return <p className="text-red-500">Error fetching round data.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Students selected in{" "}
        <span className="capitalize">{roundName} Round</span>
      </h2>

      <div className="mb-4 flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Input
          className="sm:max-w-sm flex-1"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-3 items-center">
          <Badge variant="outline">
            {filteredResults.length} students found
          </Badge>
          <Button
            variant="destructive"
            disabled={selectedUsernames.length === 0 || isDeleting}
            onClick={() => handleDelete(selectedUsernames)}
          >
            {isDeleting ? (
              <span className="flex gap-1 items-center">
                <Loader2 className="animate-spin h-4 w-4" /> Deleting...
              </span>
            ) : (
              `Delete ${selectedUsernames.length} Selected`
            )}
          </Button>

          <Button onClick={handleExportToExcel}>Export to Excel</Button>
        </div>
      </div>

      {isDebouncing ? (
        <div className="space-y-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : filteredResults.length < 1 ? (
        <p className="text-center font-medium mt-4">
          <span className="flex flex-col gap-1 items-center">
            <Users2 />
            No user found with the given username.
          </span>
        </p>
      ) : (
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="center-m">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={
                      filteredResults.length > 0 &&
                      filteredResults.every((r) =>
                        selectedUsernames.includes(r.user.username)
                      )
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsernames(
                          filteredResults.map((r) => r.user.username)
                        );
                      } else {
                        setSelectedUsernames([]);
                      }
                    }}
                  />
                  Select All
                </TableHead>

                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Delete</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => {
                const user = result.user;
                if (result.status !== "Qualified") return null;
                return (
                  <TableRow key={result.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsernames.includes(user.username)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsernames((prev) => [
                              ...prev,
                              user.username,
                            ]);
                          } else {
                            setSelectedUsernames((prev) =>
                              prev.filter((u) => u !== user.username)
                            );
                          }
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>
                      <a
                        href={import.meta.env.VITE_BACKEND_URL + user.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Resume
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          result.status === "Qualified"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {result.status}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Trash
                            size={16}
                            className="text-red-600 cursor-pointer"
                          />
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this user.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.username)}
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-600/80"
                            >
                              {!isDeleting ? (
                                <span>Delete</span>
                              ) : (
                                <span className="flex gap-1 items-center">
                                  <Loader2 className="animate-spin" />{" "}
                                  Deleting...
                                </span>
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default StudentManagementTable;
