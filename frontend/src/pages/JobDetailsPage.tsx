import JobDetailsDashboard from "@/components/admin/dashboard/JobDetailsDashboard";
import { useDashboardStore } from "@/store/dashboardStore";

const JobDetailsPage = () => {
  const { jobSummaries } = useDashboardStore();

  return <JobDetailsDashboard jobSummaries={jobSummaries} />;
};

export default JobDetailsPage;
