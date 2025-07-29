import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface JobSummary {
  jobId: string;
  specializationCounts: Record<string, number>;
}

interface ApplicationsChartProps {
  jobSummaries: JobSummary[];
}

const ApplicationsChart = ({ jobSummaries }: ApplicationsChartProps) => {
  // Aggregate specialization counts across all jobs
  const aggregatedData = jobSummaries.reduce((acc, job) => {
    Object.entries(job.specializationCounts).forEach(
      ([specialization, count]) => {
        if (acc[specialization]) {
          acc[specialization] += count;
        } else {
          acc[specialization] = count;
        }
      }
    );
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(aggregatedData).map(([name, value]) => ({
    name: name.replace("CSE-", "").replace("-", " "),
    applications: value,
    fullName: name,
  }));

  const chartConfig = {
    applications: {
      label: "Applications",
      color: "hsl(262, 83%, 58%)",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="h-full"
    >
      <Card className="bg-gradient-to-br from-white to-purple-50/50  border-0 shadow-lg h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
              Applications by Specialization
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pt-0 min-h-0 pb-10">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                >
                  <defs>
                    <linearGradient
                      id="applicationsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(262, 83%, 58%)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(262, 83%, 58%)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    stroke="hsl(var(--muted-foreground))"
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    stroke="hsl(var(--muted-foreground))"
                    width={30}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={{
                      stroke: "hsl(262, 83%, 58%)",
                      strokeWidth: 1,
                      strokeDasharray: "3 3",
                    }}
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="hsl(262, 83%, 58%)"
                    strokeWidth={3}
                    fill="url(#applicationsGradient)"
                    dot={{
                      r: 4,
                      fill: "hsl(262, 83%, 58%)",
                      strokeWidth: 2,
                      stroke: "white",
                      className: "drop-shadow-sm",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No specialization data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ApplicationsChart;
