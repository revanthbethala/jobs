import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getJobApplications } from "@/services/jobServices";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
import { ArrowLeft, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

function JobApplications() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["job-applications", jobId],
    queryFn: () => getJobApplications(jobId!),
    enabled: !!jobId,
  });
  const navigate = useNavigate();
  const handleExportToExcel = () => {
    const exportData = filteredApplications?.map((app) => {
      const user = app.user;

      const btech = user.education?.find(
        (edu) => edu.educationalLevel === "B.Tech"
      );
      const twelfthOrDiploma = user.education?.find(
        (edu) =>
          edu.educationalLevel === "12th" ||
          edu.educationalLevel?.toLowerCase() === "diploma"
      );
      const tenth = user.education?.find(
        (edu) => edu.educationalLevel === "10th"
      );

      return {
        "Full Name": `${user.firstName} ${user.lastName}`,
        Username: user.username,
        Email: user.email,
        Phone: user.phoneNumber,
        Gender: user.gender,
        Resume: import.meta.env.VITE_BACKEND_URL + app.resume,
        "B.Tech %": btech?.percentage ?? "N/A",
        "12th/Diploma %": twelfthOrDiploma?.percentage ?? "N/A",
        "10th %": tenth?.percentage ?? "N/A",
        "Applied At": format(new Date(app.appliedAt), "dd MMM yyyy"),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData || []);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileBlob, `Job_Applications_${data?.jobTitle || "Export"}.xlsx`);
  };

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

  return (
    <div>
      <Button
        variant="outline"
        className="flex gap-1"
        onClick={() => navigate("/posted-jobs")}
      >
        <ArrowLeft /> Back to Jobs
      </Button>
      <Card className="m-4 shadow-xl border">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold capitalize">
              Applications for: {data?.jobTitle}
            </h2>
            <h3 className="font-medium text-brand-blue-dark">
              Applications Received:
              {data?.applications?.length < 10
                ? `0${data?.applications?.length}`
                : data?.applications?.length}
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
          <Button
            onClick={handleExportToExcel}
            className=" bg-brand-blue-light hover:bg-brand-blue-light/80 mt-2 md:mt-0"
          >
            Export to Excel
          </Button>
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
                <TableHead>B.Tech</TableHead>
                <TableHead>12th/Diploma</TableHead>
                <TableHead>10th</TableHead>
                <TableHead>Applied At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications?.length > 0 ? (
                filteredApplications.map((app) => {
                  const user = app.user;

                  const btech = user.education?.find(
                    (edu) => edu.educationalLevel === "B.Tech"
                  );
                  const twelfthOrDiploma = user.education?.find(
                    (edu) =>
                      edu.educationalLevel === "12th" ||
                      edu.educationalLevel?.toLowerCase() === "diploma"
                  );
                  const tenth = user.education?.find(
                    (edu) => edu.educationalLevel === "10th"
                  );

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
                      <TableCell>{btech?.percentage ?? "N/A"}%</TableCell>
                      <TableCell>
                        {twelfthOrDiploma?.percentage ?? "N/A"}%
                      </TableCell>
                      <TableCell>{tenth?.percentage ?? "N/A"}%</TableCell>
                      <TableCell>
                        {format(new Date(app.appliedAt), "dd MMM yyyy")}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
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
    </div>
  );
}

export default JobApplications;
