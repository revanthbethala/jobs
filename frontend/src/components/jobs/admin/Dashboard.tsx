import { getAdminDashboard } from "@/services/userServices";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
function Dashboard() {
  const { data:dashboard_info, error, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });
  const data = dashboard_info?.dashboard
  console.log(data);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Jobs", value: data?.totalJobs },
          { label: "Total Users", value: data?.totalUsers },
          { label: "Total Applications", value: data?.totalApplications },
          { label: "Qualified Students", value: data?.totalQualified },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-blue-600">
              {stat.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications per Job Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Applications per Job</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.jobSummaries?.map((job) => ({
              name: job.title,
              applications: job.applications.length,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Qualified per Round per Job */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Qualified Students Per Round</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] overflow-x-auto">
          <div className="w-[1000px]">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data.jobSummaries.map((job) => {
                const roundData: Record<string, number> = {};
                job.rounds.forEach((r) => {
                  roundData[`Round ${r.roundNumber}`] = r.results.length;
                });
                return {
                  name: job.title,
                  ...roundData,
                };
              })}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Array.from({ length: 5 }, (_, i) => (
                  <Bar
                    key={`Round ${i + 1}`}
                    dataKey={`Round ${i + 1}`}
                    fill={`hsl(${(i + 1) * 60}, 70%, 50%)`}
                    stackId="a"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};



export default Dashboard;
