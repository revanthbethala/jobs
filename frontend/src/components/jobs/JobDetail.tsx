import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  MapPin,
  Calendar,
  Banknote,
  Users,
  ExternalLink,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { Job } from "@/types/job";

interface JobDetailProps {
  job: Job;
}

export const JobDetail = ({ job }: JobDetailProps) => {
  const isEligible = false; // This would come from your backend logic

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="w-16 h-16 rounded-lg object-cover border"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {job.jobTitle}
              </h1>
              <div className="flex items-center space-x-2 mt-1 text-gray-600">
                <span className="font-medium">{job.companyName}</span>
                <span>|</span>
                <span>{job.location}</span>
                <span>|</span>
                <span className="capitalize">{job.jobType}</span>
              </div>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Apply Now
          </Button>
        </div>

        {!isEligible && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              You are not eligible for this job opening. Go to 'Eligibility
              Criteria' tab to find out why
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="job-description" className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="job-description">Job Description</TabsTrigger>
            <TabsTrigger value="hiring-workflow">Hiring Workflow</TabsTrigger>
            <TabsTrigger value="eligibility-criteria" className="relative">
              Eligibility Criteria
              {!isEligible && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="job-description" className="mt-0">
            <div className="space-y-6">
              {/* Opening Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Opening Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Category
                      </label>
                      <p className="text-gray-900">{job.jobRole}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Job Functions
                      </label>
                      <p className="text-gray-900">{job.jobType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Job Profile CTC
                      </label>
                      <p className="text-gray-900">{job.salary}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Experience Required
                      </label>
                      <p className="text-gray-900">{job.experience}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Other Info
                    </label>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Apply by{" "}
                          {format(
                            new Date(job.lastDateToApply),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {job.jobDescription}
                </p>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Additional Information
                </h3>
                <p className="text-gray-600">
                  No Additional Information added for this job profile
                </p>
              </div>

              {/* Attached Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Attached Documents
                </h3>
                <p className="text-gray-600">No documents attached</p>
              </div>

              {/* About Company */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  About {job.companyName}
                </h3>
                <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-4 h-4" />
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Visit Company Website
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hiring-workflow" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hiring Process</h3>
              <div className="space-y-4">
                {job.rounds.map((round, index) => (
                  <Card key={round.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">
                              {round.roundNumber}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {round.roundName}
                          </h4>
                          <p className="text-gray-600 mt-1">
                            {round.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="eligibility-criteria" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Eligibility Criteria</h3>
              {!isEligible ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    <div className="space-y-2">
                      <p className="font-medium">
                        You don't meet the following requirements:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Minimum 5+ years of experience required</li>
                        <li>
                          Strong proficiency in React and TypeScript required
                        </li>
                        <li>
                          Previous experience with large-scale applications
                          preferred
                        </li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-green-800 font-medium">
                      You meet all the eligibility criteria for this position!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
