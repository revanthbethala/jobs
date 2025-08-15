import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {format} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Target,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

interface RoundSummary {
  roundNumber: number;
  roundName: string;
  qualifiedUsers: number;
}

interface JobDetailsProps {
  jobSummaries;
}

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(142, 76%, 36%)",
  "hsl(262, 83%, 58%)",
  "hsl(346, 87%, 43%)",
  "hsl(31, 81%, 56%)",
];

const JobDetailsDashboard = ({ jobSummaries }: JobDetailsProps) => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  useEffect(() => {
    if (!jobSummaries?.length) {
      navigate("/dashboard", { replace: true });
    }
  }, [jobSummaries, navigate]);

  const job = jobSummaries.find((j) => j.jobId === jobId);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const roundsData = job.roundSummaries.map((round: RoundSummary) => ({
    name: round.roundName,
    qualified: round.qualifiedUsers,
    roundNumber: round.roundNumber,
  }));

  const specializationData = Object.entries(job.specializationCounts || {}).map(
    ([name, value]) => ({
      name: name.replace("CSE-", "").replace("-", " "),
      value,
      fullName: name,
    })
  );

  const roundsConfig = {
    qualified: {
      label: "Qualified Users",
      color: "hsl(142, 76%, 36%)",
    },
  };

  const specializationConfig = {
    applications: {
      label: "Applications",
    },
    ...Object.fromEntries(
      specializationData.map((item, index) => [
        item.fullName.toLowerCase().replace(/[^a-z0-9]/g, ""),
        {
          label: item.fullName,
          color: COLORS[index % COLORS.length],
        },
      ])
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="bg-gradient-to-r from-white to-blue-50/50 rounded-xl shadow-sm border p-6">
            <h1 className="text-3xl font-bold capitalize bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {job.jobTitle} - Job Details
            </h1>
          </div>
        </motion.div>

        {/* Enhanced Summary Stats with gradients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Applications",
              value: job.totalApplications,
              icon: Users,
              color: "blue",
              gradient: "from-blue-500 to-blue-600",
            },
            // {
            //   title: "Qualification Ratio",
            //   value: job.qualificationRatio,
            //   icon: TrendingUp,
            //   color: "green",
            //   gradient: "from-green-500 to-green-600",
            // },
            {
              title: "Total Rounds",
              value: job.totalRounds,
              icon: Target,
              color: "purple",
              gradient: "from-purple-500 to-purple-600",
            },
            {
              title: "Posted Date",
              value: format(new Date(job.postedAt), "dd/MM/yyyy"),
              icon: Calendar,
              color: "orange",
              gradient: "from-orange-500 to-orange-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <Card
                className={`bg-gradient-to-br from-white to-${stat.color}-50/50  border-0 shadow-lg`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-sm`}
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {typeof stat.value === "string"
                      ? stat.value
                      : stat.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Qualified Users Chart with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                    Users Qualified by Round
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={roundsConfig} className="h-[300px]">
                  <BarChart
                    data={roundsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="roundsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(142, 76%, 36%)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(142, 76%, 36%)"
                          stopOpacity={0.2}
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
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      //   stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="qualified"
                      fill="url(#roundsGradient)"
                      radius={[6, 6, 0, 0]}
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Specialization Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                    Applications by Specialization
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {specializationData.length > 0 ? (
                  <ChartContainer
                    config={specializationConfig}
                    className="h-[300px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={specializationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {specializationData.map((entry, index) => (
                          <>
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="white"
                              strokeWidth={2}
                            />
                          </>
                        ))}
                      </Pie>
                    </PieChart>
                    <div>
                      <ul className="flex  items-center justify-center *:gap-2 text-sm">
                        {specializationData.map((entry, index) => (
                          <li
                            key={entry.name}
                            className="flex items-center gap-2"
                          >
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="font-medium text-gray-700">
                              {entry.name}
                            </span>
                            <span className="ml-auto text-gray-500">
                              {entry.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No specialization data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Interview Rounds Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="bg-white  border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                Interview Rounds Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {job.roundSummaries.map((round: RoundSummary) => (
                  <Card
                    key={round.roundNumber}
                    className="border-l-4 border-l-blue-500 bg-blue-50/50"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">
                          Round {round.roundNumber}
                        </CardTitle>
                        <Badge
                          variant={
                            round.qualifiedUsers > 0 ? "default" : "secondary"
                          }
                          className={
                            round.qualifiedUsers > 0
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {round.qualifiedUsers} Qualified
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground capitalize font-medium">
                        {round.roundName}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetailsDashboard;
