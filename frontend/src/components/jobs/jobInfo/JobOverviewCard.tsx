import { Building2, MapPin, Clock, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Job } from "@/types/jobTypes";

interface JobOverviewCardProps {
  job: Job;
  jobStatus: string | null;
  isTimeOver: boolean;
  role: string;
  onApply: () => void;
  itemVariants;
}

export function JobOverviewCard({
  job,
  jobStatus,
  isTimeOver,
  role,
  onApply,
  itemVariants,
}: JobOverviewCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-8 overflow-hidden border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-start gap-4 flex-1">
              {job.companyLogo && (
                <div className="relative">
                  <img
                    loading="lazy"
                    src={`${import.meta.env.VITE_BACKEND_URL}${
                      job.companyLogo
                    }`}
                    alt="logo"
                    className="w-20 h-20 rounded-xl object-cover shadow-md"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold mb-3 capitalize leading-tight">
                  {job.jobTitle}
                </h1>
                <div className="flex text-sm flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Building2 className="w-4 h-4 text-brand-blue-light" />
                    <span className="font-medium">{job.companyName}</span>
                  </span>
                  <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="font-medium">{job.location}</span>
                  </span>
                  <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{job.jobType}</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Posted{" "}
                    {formatDistanceToNow(new Date(job.postedDate), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="font-medium">
                    Apply by{" "}
                    {format(new Date(job?.lastDateToApply), "dd/MM/yy hh:mm a")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-right">
                <p className="text-xl font-bold capitalize">
                  Salary: {job.salary}
                </p>
              </div>
              {role === "USER" && (
                <span>
                  {jobStatus ? (
                    <Button
                      disabled={true}
                      className={cn(
                        jobStatus &&
                          "bg-gray-600 text-white hover:bg-gray-600/90",
                        "py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      )}
                    >
                      Already Applied
                    </Button>
                  ) : isTimeOver ? (
                    <Button variant="destructive">Applications Closed</Button>
                  ) : (
                    <Button
                      onClick={onApply}
                      className="bg-brand-blue-light hover:bg-brand-blue-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Apply Now
                    </Button>
                  )}
                </span>
              )}
              {job.applications?.length && (
                <span className="text-sm text-brand-blue-dark tracking-tight font-medium">
                  {job.applications?.length}+ students applied
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
