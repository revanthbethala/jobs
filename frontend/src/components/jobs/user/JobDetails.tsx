import { Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";
import {
  applyJob,
  getJobById,
  getUserApplications,
} from "@/services/jobServices";
import { getProfile } from "@/services/profileService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getIncompleteFields } from "@/lib/IncompleteFields";
import { ApplicationAlerts } from "../jobInfo/ApplicationAlerts";
import { JobOverviewCard } from "../jobInfo/JobOverviewCard";
import { JobHeader } from "../jobInfo/JobHeader";
import { InterviewRounds } from "../jobInfo/InterviewRounds";
import { EligibilityCriteria } from "../jobInfo/EligibilityCriteria";
import { SkillsRequired } from "../jobInfo/SkillsRequired";
import { JobDescription } from "../jobInfo/JobDescription";
import { CompanyContactCard, JobDetailsCard } from "../jobInfo/JobDetailsCard";

const role = useAuthStore.getState().role;

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [isTimeOver, setIsTimeOver] = useState(false);

  // Queries
  const {
    data: userData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["profileData"],
    queryFn: getProfile,
  });

  const {
    data: applicationsData,
    isLoading: isApplicationLoading,
    isError: isApplicationError,
  } = useQuery({
    queryKey: ["userApplications"],
    queryFn: getUserApplications,
    refetchOnMount: false,
  });

  const {
    data: job,
    isLoading: isJobLoading,
    error: jobError,
    isError,
  } = useQuery({
    queryKey: ["jobDetails"],
    queryFn: () => getJobById(jobId!),
  });

  // Effects
  useEffect(() => {
    if (!applicationsData?.applications) return;

    const matched = applicationsData.applications.find(
      (app) => app.jobId === jobId
    );

    if (matched) {
      setJobStatus(matched.status);
    }
  }, [jobId, applicationsData]);

  useEffect(() => {
    if (job?.lastDateToApply) {
      const isOver = Date.now() > new Date(job.lastDateToApply).getTime();
      setIsTimeOver(isOver);
    }
  }, [job?.lastDateToApply]);

  // Handlers
  const handleSubmit = async () => {
    const incompleteCount = getIncompleteFields(userData);
    console.log("count", incompleteCount);
    if (incompleteCount > 0) {
      setShowAlert(true);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleApply = async () => {
    try {
      setIsLoading(true);
      const res = await applyJob(job?.id);
      setIsLoading(false);
      setJobStatus("Pending");
      toast({
        title: "Applied to job successfully",
        description:
          "Your application had been sent to recruiter.Please wait for further instructions",
      });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const err_msg = error.response?.data?.message;
      toast({
        title: err_msg || "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleGoToProfile = () => {
    navigate("/profile/update-profile");
    setShowAlert(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Loading states
  if (isJobLoading || isProfileLoading || isApplicationLoading) {
    return <LoadingSpinner />;
  }

  if (isError || isApplicationError || isProfileError) {
    console.error("Error loading details:", jobError);
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load job details.</p>
      </div>
    );
  }

  if (isJobLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      {/* Application Alerts */}
      <ApplicationAlerts
        showAlert={showAlert}
        showConfirmation={showConfirmation}
        isLoading={isLoading}
        jobTitle={job.jobTitle}
        companyName={job.companyName}
        onCloseAlert={() => setShowAlert(false)}
        onCloseConfirmation={() => setShowConfirmation(false)}
        onGoToProfile={handleGoToProfile}
        onConfirmApply={handleApply}
      />

      {/* Header */}
      <JobHeader onBack={() => navigate(-1)} />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Job Overview - Top Section */}
          <JobOverviewCard
            job={job}
            jobStatus={jobStatus}
            isTimeOver={isTimeOver}
            role={role}
            onApply={handleSubmit}
            itemVariants={itemVariants}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Interview Process - TOP PRIORITY */}
              <JobDescription
                description={job.jobDescription}
                serviceAgreement={job.serviceAgreement}
                isExpanded={isDescriptionExpanded}
                onToggleExpanded={() =>
                  setIsDescriptionExpanded(!isDescriptionExpanded)
                }
                itemVariants={itemVariants}
              />
              <InterviewRounds
                rounds={job.rounds || []}
                itemVariants={itemVariants}
              />

              {/* Eligibility Criteria - TOP PRIORITY */}
              <EligibilityCriteria
                allowedBranches={job.allowedBranches}
                allowedPassingYears={job.allowedPassingYears}
                itemVariants={itemVariants}
              />

              {/* Skills Required - MEDIUM PRIORITY */}
              <SkillsRequired
                skills={job.skillsRequired}
                itemVariants={itemVariants}
              />

              {/* Job Description - MEDIUM PRIORITY */}
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* Quick Job Info */}
              <JobDetailsCard job={job} itemVariants={itemVariants} />

              {/* Company Info - LOWER PRIORITY (Minimized) */}
              <CompanyContactCard
                companyWebsite={job.companyWebsite}
                itemVariants={itemVariants}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
