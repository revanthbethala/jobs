import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/types/job";
import { ExternalLink } from "lucide-react";

interface JobDetailsCardProps {
  job: Job;
  itemVariants: any;
}

export function JobDetailsCard({ job, itemVariants }: JobDetailsCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Experience</span>
            <span className="font-semibold">{job.experience} year</span>
          </div>
          <hr />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Job Role</span>
            <span className="font-semibold">{job.jobRole}</span>
          </div>
          <hr />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Job Type</span>
            <Badge variant="outline">{job.jobType}</Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}




interface CompanyContactCardProps {
  companyWebsite?: string;
  itemVariants: any;
}

export function CompanyContactCard({
  companyWebsite,
  itemVariants,
}: CompanyContactCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Company Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {companyWebsite && (
            <a
              href={companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand-blue-light hover:text-brand-blue-dark transition-colors group"
            >
              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Visit Website</span>
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
