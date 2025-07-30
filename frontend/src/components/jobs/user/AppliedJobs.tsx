import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "@/services/jobServices";
import { useJobStore } from "@/store/jobStore";
import type { AppliedJob } from "@/types/jobTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

function AppliedJobs() {
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userApplications"],
    queryFn: getUserApplications,
  });

  useEffect(() => {
    if (data?.applications) {
      setApplications(data.applications);
    }
  }, [data]);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600">Something went wrong.</p>
    );
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Applied Jobs
      </h2>
      <div className="overflow-auto rounded-xl shadow-sm border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Applied At</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">
                  {app.job.jobTitle}
                </TableCell>
                <TableCell>{app.job.companyName}</TableCell>
                <TableCell>
                  {format(new Date(app.appliedAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <a
                    href={import.meta.env.VITE_BACKEND_URL + app.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View Resume
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      app.status.toLowerCase() === "pending" &&
                        "bg-pending hover:bg-pending/90 text-gray-100"
                    )}
                    variant={
                      app.status === "selected"
                        ? "default"
                        : app.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`job/${app.job.id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {applications.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No job applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AppliedJobs;
