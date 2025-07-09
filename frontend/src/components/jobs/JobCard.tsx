import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Building2 } from "lucide-react";

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

export const JobCard = ({ job, isSelected, onClick }: JobCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(job.postedDate), {
    addSuffix: true,
  });

  return (
    <div
      className={`p-6 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-blue-50 border-r-4 border-r-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={job.companyLogo}
            alt={`${job.companyName} logo`}
            className="w-12 h-12 rounded-lg object-cover border"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {job.jobTitle}
          </h3>

          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
            <Building2 className="w-4 h-4" />
            <span>{job.companyName}</span>
            <span>•</span>
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>

          <div className="mt-2 text-sm text-gray-500">{timeAgo}</div>

          {job.jobType === "Internship" && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {job.jobType}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
