import { deleteRound, getSpecificRoundResults } from "@/services/roundServices";
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
const ITEMS_PER_CHUNK = 20;

function StudentManagementTable() {
  const { jobId } = useParams();
  const { selectedRound, rounds } = useJobRoundsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, isDebouncing] = useDebounce(searchTerm, 500);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_CHUNK);
  const [isDeleting, setIsDeleting] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const round = rounds?.find((r) => r.roundNumber === selectedRound);
  const roundName = round?.roundName;
  const roundId = round?.id;

  const isEnabled = !!jobId && !!roundName;

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["round-details", jobId, roundName],
    queryFn: () => getSpecificRoundResults(jobId!, roundName!),
    enabled: isEnabled,
    retry: false,
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
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // const res = await deleteRound(roundId);
      toast({
        title: "User deleted successfully",
      });
    } catch (err) {
      console.log(err);
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

  // Infinite scroll: Load more when user scrolls to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount((prev) => prev + ITEMS_PER_CHUNK);
        }
      },
      { threshold: 1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Reset visible count on new search
  useEffect(() => {
    setVisibleCount(ITEMS_PER_CHUNK);
  }, [debouncedQuery]);

  if (!selectedRound || !roundName) {
    return <p className="text-muted">Select a round to view student data.</p>;
  }

  if (isLoading) return <p>Loading round details...</p>;

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
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.slice(0, visibleCount).map((result) => {
                const user = result.user;
                return (
                  <TableRow key={result.id}>
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
                    <TableCell>
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
                              permanently delete this round.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div ref={loadMoreRef} className="h-8" />
        </div>
      )}
    </div>
  );
}

export default StudentManagementTable;
