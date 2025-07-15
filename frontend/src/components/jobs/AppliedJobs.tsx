import { getUserApplications } from "@/services/jobServices";
import { useQuery } from "@tanstack/react-query";
import JobCard from "./JobCard";
import { useJobStore } from "@/store/jobStore";
import { useEffect, useState } from "react";
import { JobDetails } from "./JobDetails";

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["userApplications"],
    queryFn: getUserApplications,
  });

  useEffect(() => {
    if (data?.applications) {
      setApplications(data.applications);
    }
  }, [data]);

  const { setSelectedJob, selectedJob } = useJobStore();

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };
  const handleBackToList = () => {
    setSelectedJob(null);
  };
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong.</p>;

  if (selectedJob)
    return <JobDetails job={selectedJob} onBack={handleBackToList} />;
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
      {applications.map((jobApp, index) => (
        <JobCard
          key={jobApp.id || index}
          job={jobApp.job}
          onViewDetails={handleViewDetails}
          index={index}
        />
      ))}
    </div>
  );
}

export default AppliedJobs;
