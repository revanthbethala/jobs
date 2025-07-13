"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Job } from "@/types/jobTypes";

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  index: number;
}

export default function JobCard({ job, onViewDetails, index }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-brand-blue-light">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={job.companyLogo || "/placeholder.svg?height=48&width=48"}
                  alt="logo"
                  className="rounded-lg object-cover"
                  // onError={(e) => {
                  //   const target = e.target as HTMLImageElement;
                  //   target.src = "/placeholder.svg?height=48&width=48";
                  // }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {job.jobTitle}
                </h3>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{job.companyName}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="flex-shrink-0">
              {job.jobType}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-blue-light flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="truncate">{job.experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="truncate">
                {formatDistanceToNow(new Date(job.postedDate), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-700 line-clamp-2">
              {job.jobDescription}
            </p>
            <div className="flex flex-wrap gap-1">
              {job.skillsRequired.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skillsRequired.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skillsRequired.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-3">
          <Button
            onClick={() => onViewDetails(job)}
            className="w-full bg-brand-blue-light hover:bg-brand-blue-dark transition-colors"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
