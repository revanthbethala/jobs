import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface SpecializationData {
  _count: {
    specialization: number;
  };
  specialization: string;
}

interface SpecializationChartProps {
  data: SpecializationData[];
}

const COLORS = [
  "hsl(217, 91%, 60%)", // Blue
  "hsl(142, 76%, 36%)", // Green
  "hsl(262, 83%, 58%)", // Purple
  "hsl(346, 87%, 43%)", // Red
  "hsl(31, 81%, 56%)", // Orange
];

const SpecializationChart = ({ data }: SpecializationChartProps) => {
  console.log(data);
  const chartData = data?.map((item) => ({
    name: item.specialization.replace("CSE-", "").replace("-", " "),
    value: item._count.specialization,
    fullName: item.specialization,
  }));

  const chartConfig = {
    users: {
      label: "Users",
    },
    ...Object.fromEntries(
      chartData.map((item, index) => [
        item.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
        {
          label: item.name,
          color: COLORS[index % COLORS.length],
        },
      ])
    ),
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent < 0.05) return null; // Don't show label if slice is too small

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={"center"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {percent}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="h-full"
    >
      <Card className="bg-gradient-to-br from-white to-blue-50/50  border-0 shadow-lg h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
              B.Tech Specializations
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pt-0 min-h-0">
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={renderCustomizedLabel}
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="white"
                  strokeWidth={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {chartData.map((entry, index) => (
              <div
                key={entry.name}
                className="flex items-center gap-1.5 text-xs"
              >
                <div
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700 font-medium">{entry.name}</span>
                <span className="text-gray-500">({entry.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SpecializationChart;
