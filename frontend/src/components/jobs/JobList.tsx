import React from "react";
import { JobCard } from "./JobCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job } from "@/types/job";

interface JobListProps {
  jobs: Job[];
  selectedJobId?: string;
  onJobSelect: (job: Job) => void;
}

export const JobList = ({ jobs, selectedJobId, onJobSelect }: JobListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Tabs defaultValue="all-jobs" className="w-full">
        <div className="border-b px-6 py-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="all-jobs" className="text-sm font-medium">
              All Jobs
            </TabsTrigger>
            <TabsTrigger value="applied-jobs" className="text-sm font-medium">
              Applied Jobs
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all-jobs" className="mt-0">
          <div className="space-y-0">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={job.id === selectedJobId}
                onClick={() => onJobSelect(job)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applied-jobs" className="mt-0">
          <div className="p-6 text-center text-gray-500">
            No applied jobs yet
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
