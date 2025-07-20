import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteJob, getAllJobs } from "@/services/jobServices";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DateValues, format } from "date-fns";
import { motion } from "framer-motion";
import {
  Trash2,
  Pencil,
  Eye,
  ArrowDownZA,
  ArrowUpZA,
  ArrowDownAZ,
  ArrowUpAZ,
  Briefcase,
  BriefcaseBusiness,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Job } from "@/types/jobTypes";
import useDebounce from "@/hooks/use-debounce";
import { useNavigate } from "react-router-dom";

// 🧠 Custom debounce hook

export default function MyJobsTable() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posted-jobs"],
    queryFn: getAllJobs,
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const navigate = useNavigate();
  const handleView = (jobId: string) => {
    console.log("Viewing job:", jobId);
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      toast({
        title: "Job deleted successfully",
        description: `Job with ID ${jobId} has been deleted.`,
      });
      refetch();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error deleting job",
        description: "Failed to delete the job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenUpdateDialog = (jobId) => {
    setSelectedJobId(jobId);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateJob = (jobId: string) => {
    console.log("Confirmed update for job:", selectedJobId);
    navigate(`/update-job/${jobId}`);

    setIsUpdateDialogOpen(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600 font-medium">Failed to load jobs.</div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="h-[calc(100vh-150px)] flex flex-col items-center justify-center text-center text-gray-500 px-4">
        <BriefcaseBusiness className="w-16 h-16 mb-4 opacity-60" />
        <h3 className="text-lg font-semibold">No jobs posted yet</h3>
        <p className="text-sm mt-1">
          Start by clicking the "Post a Job" button to create one.
        </p>
        <Button
          className="mt-4 bg-brand-blue-light hover:bg-brand-blue-light/80"
          onClick={() => navigate("/post-job")}
        >
          Post a Job
        </Button>
      </div>
    );
  }
  const filteredJobs = data
    ?.filter((job: Job) =>
      job.jobTitle.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aDate = new Date(a.postedDate).getTime();
      const bDate = new Date(b.postedDate).getTime();
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    });
  console.log(data);

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">My Posted Jobs</h2>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by job title..."
          className="w-full sm:w-1/2 p-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead
                onClick={toggleSortOrder}
                className="cursor-pointer select-none flex items-center gap-1"
              >
                Posted On
                {sortOrder === "desc" ? (
                  <ArrowDownAZ className="w-4 h-4" />
                ) : (
                  <ArrowUpAZ className="w-4 h-4" />
                )}
              </TableHead>

              <TableHead>View Details</TableHead>
              <TableHead>Update Jobs</TableHead>
              <TableHead>Delete Jobs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs?.map((job: Job) => (
              <TableRow key={job.id} className="hover:bg-muted/40 transition">
                <TableCell className="font-medium capitalize">
                  {job.jobTitle}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {job.jobType}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {job.companyName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(job.postedDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleView(job.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Dialog
                    open={isUpdateDialogOpen && selectedJobId === job.id}
                    onOpenChange={setIsUpdateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenUpdateDialog(job.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Job Update</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to update the job "
                          {job.jobTitle}"?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => setIsUpdateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => handleUpdateJob(job.id)}>
                          Yes, Update
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Job</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the job "
                          {job.jobTitle}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(job.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
