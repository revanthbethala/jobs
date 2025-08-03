import { useDashboardStore } from "@/store/dashboardStore";
import { motion } from "framer-motion";
import { Briefcase, Users, Calendar, BriefcaseBusiness } from "lucide-react";
import SpecializationChart from "../components/admin/dashboard/SpecializationChart";
import StatCard from "../components/admin/dashboard/StatCard";
import JobsTimelineChart from "../components/admin/dashboard/JobTimelineChart";
import ApplicationsChart from "../components/admin/dashboard/ApplicationsChart";
import JobsInfo from "../components/admin/dashboard/JobsInfo";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/services/userServices";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { setDashboardData } = useDashboardStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getAdminDashboard,
  });

  console.log(data?.dashboard);
  useEffect(() => {
    if (data) {
      setDashboardData(data?.dashboard);
    }
  }, [data, setDashboardData]);
  console.log(data);
  const {
    totalJobsPostedByAdmin,
    totalUsers,
    btechSpecializations,
    jobSummaries,
    getPeakJobsDate,
  } = useDashboardStore();
  const peakDate = getPeakJobsDate();
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Unknown error occurred</div>;
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 md:mb-8"
        >
          <div className=" md:p-6">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Total Jobs Posted"
            value={totalJobsPostedByAdmin}
            icon={Briefcase}
            delay={0.1}
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            delay={0.2}
            color="green"
          />
          <StatCard
            title="Peak Day Jobs"
            value={peakDate.count}
            suffix=""
            icon={Calendar}
            delay={0.4}
            trend={peakDate.date ? format(peakDate?.date, "yy/mm/dd") : null}
            color="orange"
          />
        </div>

        {/* Professional Charts Section with Fixed Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {btechSpecializations.length > 0 ? (
            <div className="w-full">
              <SpecializationChart data={btechSpecializations} />
            </div>
          ) : (
            <div className="text-red-600 flex items-center justify-center font-medium">
              No data available
            </div>
          )}
          {jobSummaries.length > 0 ? (
            <>
              <div className="w-full">
                <JobsTimelineChart jobSummaries={jobSummaries} />
              </div>
              <div className="w-full lg:col-span-2 xl:col-span-1">
                <ApplicationsChart jobSummaries={jobSummaries} />
              </div>
            </>
          ) : (
            <div className="text-red-600 flex items-center justify-center font-semibold">
              No applications received
            </div>
          )}
        </div>

        {/* Enhanced Jobs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              Your Posted Jobs
            </h2>
            <div
              className={`${
                jobSummaries.length > 0
              } ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6':
                null`}
            >
              {jobSummaries.length > 0 ? (
                jobSummaries.map((job, index) => (
                  <JobsInfo
                    key={job.jobId}
                    jobTitle={job.jobTitle}
                    jobId={job.jobId}
                    companyName={job.companyName}
                    jobRole={job.jobRole}
                    postedAt={job.postedAt}
                    totalApplications={job.totalApplications}
                    // qualificationRatio={job.qualificationRatio}
                    totalRounds={job.totalRounds}
                    specializationCounts={job.specializationCounts}
                    index={index}
                    peakJobsCount={peakDate.count}
                    peakDate={peakDate.date}
                  />
                ))
              ) : (
                <div className=" flex flex-col items-center justify-center text-center text-gray-500 px-4">
                  <BriefcaseBusiness className="w-16 h-16 mb-4 opacity-60" />
                  <h3 className="text-lg font-semibold">No jobs posted yet</h3>
                  <p className="text-sm mt-1">Click here to create one.</p>
                  <Button className="mt-4 bg-brand-blue-light hover:bg-brand-blue-light/80">
                    <Link to="/post-jobs">Post a Job</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
