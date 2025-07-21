import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getJobApplications } from "@/services/jobServices";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { format } from "date-fns";
import { Download, Search } from "lucide-react";
import { AppliedJob } from "@/types/jobTypes";

function JobApplications() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["job-applications", jobId],
    queryFn: () => getJobApplications(jobId!),
    enabled: !!jobId,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplications = data?.applications.filter((app) => {
    const fullName = `${app.user.firstName} ${app.user.lastName}`.toLowerCase();
    const username = app.user.username.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      username.includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Failed to load applications.</div>;
  console.log(data);
  return (
    <Card className="m-4 shadow-xl border">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold capitalize">
            Applications for: {data?.jobTitle} <br />
          </h2>
          <h3 className="text-brand-blue-dark">
            Applications Received:
            {data?.applications?.length < 10 ? (
              <span> 0{data?.applications?.length}</span>
            ) : (
              data?.applications?.length
            )}
          </h3>
        </div>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>BTECH %</TableHead>
              <TableHead>Applied At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications?.length > 0 ? (
              filteredApplications.map((app) => {
                const user = app.user;
                // const education = user.education?.[0];
                return (
                  <TableRow key={app.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>
                      <a
                        href={import.meta.env.VITE_BACKEND_URL + app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View <Download className="w-4 h-4" />
                      </a>
                    </TableCell>
                    <TableCell>
                      {user?.education?.map((education) => {
                        return <span> {education?.educationalLevel}</span>;
                      })}
                      {/* {education?.percentage ?? "N/A"}% */}
                    </TableCell>
                    <TableCell>
                      {format(new Date(app.appliedAt), "dd MMM yyyy, hh:mm a")}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-gray-500 py-4"
                >
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default JobApplications;
