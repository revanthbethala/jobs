import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/services/userServices";

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getAdminDashboard,
  });
  console.log(data);
  return (
    // <motion.div
    //   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    // >
    //   <Card className="shadow-xl">
    //     <CardHeader>
    //       <CardTitle>Total Jobs</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <p className="text-4xl font-bold text-blue-600">{data.totalJobs}</p>
    //     </CardContent>
    //   </Card>

    //   <Card className="shadow-xl">
    //     <CardHeader>
    //       <CardTitle>Total Applications</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <p className="text-4xl font-bold text-blue-600">
    //         {data.totalApplications}
    //       </p>
    //     </CardContent>
    //   </Card>

    //   <Card className="shadow-xl">
    //     <CardHeader>
    //       <CardTitle>Total Qualified Users</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <p className="text-4xl font-bold text-blue-600">
    //         {data.totalQualified}
    //       </p>
    //     </CardContent>
    //   </Card>

    //   <Card className="col-span-1 md:col-span-2 lg:col-span-3 shadow-xl">
    //     <CardHeader>
    //       <CardTitle>Top 5 Jobs by Applications</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <ResponsiveContainer width="100%" height={300}>
    //         <BarChart
    //           data={data.topJobs.map((job) => ({
    //             name: job.jobRole,
    //             applications: job._count.applications,
    //           }))}
    //         >
    //           <XAxis dataKey="name" />
    //           <YAxis />
    //           <Tooltip />
    //           <Bar
    //             dataKey="applications"
    //             fill="#3B82F6"
    //             radius={[6, 6, 0, 0]}
    //           />
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </CardContent>
    //   </Card>

    //   <Card className="col-span-1 md:col-span-2 shadow-xl">
    //     <CardHeader>
    //       <CardTitle>Job Summary</CardTitle>
    //     </CardHeader>
    //     <CardContent className="max-h-[300px] overflow-auto">
    //       <table className="w-full text-left text-sm">
    //         <thead>
    //           <tr>
    //             <th className="p-2">Job Role</th>
    //             <th className="p-2">Applications</th>
    //             <th className="p-2">Qualified</th>
    //             <th className="p-2">Rounds</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {data.jobSummaries.map((job) => (
    //             <tr key={job.id} className="border-t">
    //               <td className="p-2">{job.jobRole}</td>
    //               <td className="p-2">{job.applications.length}</td>
    //               <td className="p-2">
    //                 {job.rounds.reduce(
    //                   (total, round) => total + round.results.length,
    //                   0
    //                 )}
    //               </td>
    //               <td className="p-2">{job.rounds.length}</td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </CardContent>
    //   </Card>
    // </motion.div>
    <div>hello</div>
  );
}
