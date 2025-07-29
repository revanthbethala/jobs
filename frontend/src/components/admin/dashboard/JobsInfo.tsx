import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobRole: string;
  postedAt: string;
  totalApplications: number;
  totalRounds: number;
  specializationCounts: Record<string, number>;
  index: number;
  peakJobsCount: number;
  peakDate: string;
}

const JobsInfo = ({
  jobId,
  jobRole,
  jobTitle,
  companyName,
  postedAt,
  totalRounds,
  specializationCounts,
  index,
}: // peakJobsCount,
// peakDate,
JobCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const hasSpecializations = Object.keys(specializationCounts).length > 0;
  const topSpecialization = hasSpecializations
    ? Object.entries(specializationCounts).sort(([, a], [, b]) => b - a)[0]
    : null;

  // const isPostedOnPeakDate = new Date(postedAt).toDateString() === peakDate;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="cursor-pointer"
      onClick={() => navigate(`jobs/${jobId}`)}
    >
      <Card className="border-2 border-gray-200 shadow-lg  hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
        <div className="h-1" />
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg md:text-xl capitalize font-semibold text-gray-900 line-clamp-2">
              {jobTitle}
            </CardTitle>

            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
            >
              {totalRounds} Rounds
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-base text-gray-600">Company: {companyName}</h4>
            <h3 className="text-sm font-semibold text-gray-800 capitalize">
              Role: {jobRole}
            </h3>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Posted on {formatDate(postedAt)}</span>
            </div>
          </div>

          {topSpecialization && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <GraduationCap className="h-3 w-3 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  Top Specialization
                </p>
                <p className="text-sm font-medium truncate">
                  {topSpecialization[0].replace("CSE-", "").replace("-", " ")} (
                  {topSpecialization[1]})
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full font-medium">View Job Info</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JobsInfo;
