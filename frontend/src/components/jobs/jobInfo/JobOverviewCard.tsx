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
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Left Section */}
            <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
              <div className="flex gap-x-5 items-center">
                {job.companyLogo && (
                  <div className="relative shrink-0">
                    <img
                      loading="lazy"
                      src={`${import.meta.env.VITE_BACKEND_URL}${
                        job.companyLogo
                      }`}
                      alt="Logo"
                      className="w-16 h-16  rounded-xl object-cover shadow-md"
                    />
                  </div>
                )}
                <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 capitalize leading-snug">
                  {job.jobTitle}
                </h1>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Building2 className="w-4 h-4 text-brand-blue-light" />
                    <span className="font-medium">{job.companyName}</span>
                  </span>
                  <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="font-medium capitalize">
                      {job.location}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                    <span className="font-medium capitalize">
                      {job.jobType}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-4 h-4" />
                    Posted {""}
                    {formatDistanceToNow(new Date(job.postedDate), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="font-medium">
                    Apply by{" "}
                    {format(new Date(job.lastDateToApply), "dd/MM/yy hh:mm a")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-start sm:items-end gap-3 sm:gap-4">
              <p className="text-lg sm:text-xl font-bold capitalize text-gray-800">
                Salary: {job.salary}
              </p>

              {role === "USER" && (
                <>
                  {jobStatus ? (
                    <Button
                      disabled
                      className={cn(
                        "bg-gray-600 text-white hover:bg-gray-600/90",
                        "py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      )}
                    >
                      Applied
                    </Button>
                  ) : isTimeOver ? (
                    <Button variant="destructive" disabled>
                      Applications Closed
                    </Button>
                  ) : (
                    <Button
                      onClick={onApply}
                      className="bg-brand-blue-light hover:bg-brand-blue-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Apply Now
                    </Button>
                  )}
                </>
              )}

              {job?.applications?.length > 0 && (
                <span className="text-sm text-brand-blue-dark tracking-tight font-medium">
                  {job.applications.length}+ students applied
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
