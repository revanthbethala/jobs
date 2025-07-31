import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { TopFilterBar } from "@/components/jobs/user/TopFilterBar";
import FilterSidebar from "@/components/jobs/user/FilterSideBar";
import { JobSkeleton } from "@/components/jobs/user/JobSkeleton";
import JobCard from "@/components/jobs/user/JobCard";
import { useJobStore } from "@/store/jobStore";
import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "@/services/jobServices";
import JobDetails from "@/components/jobs/user/JobDetails";

export default function Jobs() {
  const { filteredJobs, selectedJob, jobs, setJobs, setSelectedJob } =
    useJobStore();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["jobFetch"],
    queryFn: getAllJobs,
  });
  useEffect(() => {
    if (data) {
      setJobs(data);
    }
  }, [data]);
  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
  };

  const handleOpenFilters = () => {
    setFiltersOpen(true);
  };

  const handleCloseFilters = () => {
    setFiltersOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Filter Bar */}
      <TopFilterBar onOpenFilters={handleOpenFilters} />

      {/* Filter Sidebar */}
      <FilterSidebar isOpen={filtersOpen} onClose={handleCloseFilters} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <p className="text-red-800">Error loading jobs: {error?.message}</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <JobSkeleton key={index} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to see more results.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Available Opportunities
              </h2>
              <p className="text-gray-600">
                Discover jobs that match your skills and interests
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={handleViewDetails}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Job Details Page Component (keeping the same implementation)
