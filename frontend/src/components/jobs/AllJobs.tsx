import { getAllJobs } from "@/services/jobServices";
import { useQuery } from "@tanstack/react-query";

function Jobs() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getAllJobs"],
    queryFn: getAllJobs,
  });
  console.log('jobs',data);
  return <div>Jobs</div>;
}

export default Jobs;
