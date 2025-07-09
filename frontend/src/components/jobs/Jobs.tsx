import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "@/services/jobServices";
import { Job } from "@/types/job";
import { JobDetail } from "./JobDetail";
import { JobList } from "./JobList";
import { JobFilters } from "./JobFilters";
import { useState } from "react";

const Jobs = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    sector: "All Sectors",
    positionType: "All",
    status: "All",
    sortBy: "Created At",
  });
  const { isLoading, error, data } = useQuery({
    queryKey: ["getAllJobs"],
    queryFn: getAllJobs,
  });
  console.log(data);
  if (isLoading)
    return (
      <div className="text-center mt-10 text-muted-foreground">
        Loading jobs...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-destructive">
        Error fetching jobs
      </div>
    );

  const jobs = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <JobFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        <div className="flex gap-6">
          <div className="w-1/3">
            <JobList
              jobs={jobs}
              selectedJobId={selectedJob?.id}
              onJobSelect={setSelectedJob}
            />
          </div>

          <div className="flex-1">
            {selectedJob ? (
              <JobDetail job={selectedJob} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
