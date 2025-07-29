import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface JobSummary {
  jobId: string;
  postedAt: string;
}

interface JobsTimelineChartProps {
  jobSummaries: JobSummary[];
}

const JobsTimelineChart = ({ jobSummaries }: JobsTimelineChartProps) => {
  // Process data to get jobs posted per day
  const dailyData = jobSummaries.reduce((acc, job) => {
    const date = new Date(job.postedAt);
    const dayKey = date.toDateString();
    const dayName = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!acc[dayKey]) {
      acc[dayKey] = { day: dayName, jobs: 0, date: date.getTime() };
    }
    acc[dayKey].jobs++;
    return acc;
  }, {} as Record<string, { day: string; jobs: number; date: number }>);

  const chartData = Object.values(dailyData).sort((a, b) => a.date - b.date);

  const chartConfig = {
    jobs: {
      label: "Jobs Posted",
      color: "hsl(142, 76%, 36%)",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="h-full"
    >
      <Card className="bg-gradient-to-br from-white to-green-50/50 shadow-sm border-0 shadow-lg h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Jobs Timeline
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pt-0 min-h-0">
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(142, 76%, 36%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(142, 76%, 36%)"
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
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--muted-foreground))"
                  height={40}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--muted-foreground))"
                  width={30}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={{
                    stroke: "hsl(142, 76%, 36%)",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={3}
                  fill="url(#jobsGradient)"
                  dot={{
                    r: 5,
                    fill: "hsl(142, 76%, 36%)",
                    strokeWidth: 3,
                    stroke: "white",
                    className: "drop-shadow-sm",
                  }}
                  activeDot={{
                    r: 7,
                    fill: "hsl(142, 76%, 36%)",
                    strokeWidth: 3,
                    stroke: "white",
                    className: "drop-shadow-md",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobsTimelineChart;
