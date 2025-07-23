import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Users,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Phone,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate, useParams } from "react-router-dom";
import {
  applyJob,
  getJobById,
  getUserApplications,
} from "@/services/jobServices";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";

function getIncompleteFields(profile): number {
  const incompleteFields: string[] = [];

  for (const key in profile) {
    if (key === "token") continue;

    const value = profile[key];

    // Check top-level null
    if (value === null || value === undefined || value === "") {
      incompleteFields.push(key);
    }

    // Special case: education array
    if (key === "education") {
      if (!Array.isArray(value) || value.length === 0) {
        incompleteFields.push("education");
      } else {
        // Check each education item for required fields
        const requiredEduFields = [
          "educationalLevel",
          "institution",
          "boardOrUniversity",
          "percentage",
          "passedOutYear",
          "location",
        ];

        value.forEach((edu, index: number) => {
          requiredEduFields.forEach((field) => {
            if (!edu[field] && edu[field] !== 0) {
              incompleteFields.push(`education[${index}].${field}`);
            }
          });
        });
      }
    }
  }

  return incompleteFields.length;
}
const role = useAuthStore.getState().role;
console.log("Role", role);
export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState<string | null>(null);

  // const { profile, fetchProfile } = useProfileStore();

  const {
    data: applicationsData,
    isLoading: applicationLoading,
    error: applicationError,
  } = useQuery({
    queryKey: ["userApplications"],
    queryFn: getUserApplications,
    refetchOnMount: false,
  });
  console.log("application data", applicationsData);
  // const applicationMeta = { status: "Pending" };
  const {
    data: job,
    isLoading: isJobLoading,
    error: jobError,
    isError,
  } = useQuery({
    queryKey: ["jobDetails"],
    queryFn: () => getJobById(jobId!),
  });
  useEffect(() => {
    if (!applicationsData?.applications) return;

    const matched = applicationsData.applications.find(
      (app) => app.jobId === jobId
    );

    if (matched) {
      setJobStatus(matched.status);
      console.log("Job Status:", matched.status);
    }
  }, [jobId, applicationsData]);

  if (isError) {
    console.error("Error fetching job details:", jobError);
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load job details.</p>
      </div>
    );
  }
  const handleSubmit = async () => {
    // if (!profile) {
    //   await fetchProfile();
    // }
    // const updatedProfile = useProfileStore.getState().profile;
    //   console.log(updatedProfile);
    //   setUserId(updatedProfile?.id);
    //   const incompleteCount = getIncompleteFields(updatedProfile);
    //   if (incompleteCount > 0) {
    //     setShowAlert(true);
    //   } else {
    //     setShowConfirmation(true);
    //   }
    setShowConfirmation(true);
    console.log("U clicked Apply Now");
  };
  const handleApply = async () => {
    try {
      setIsLoading(true);
      const res = await applyJob(job?.id);
      console.log("Apply Job Response:", res);
      setIsLoading(false);
      setJobStatus("Pending");
    } catch (err) {
      const err_msg = err?.response?.data?.message;
      toast({
        title: err_msg || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };
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

  if (isJobLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }
  return (
    <div>
      {/* ALERT FOR INCOMPLETE PROFILE */}
      <div className="w-fit h-fit">
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex flex-col items-center justify-center">
                <div className="rounded-full border p-5 ">
                  <AlertTriangle size={37} className="text-red-600 " />
                </div>
                <span>Profile Incomplete</span>
              </AlertDialogTitle>
              <AlertDialogDescription>
                Your profile is incomplete. Please complete your profile before
                applying for jobs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowAlert(false)}>
                Close
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  navigate("/profile");
                  setShowAlert(false); // Close the alert dialog after clicking
                }}
              >
                Go to Profile
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {job.jobTitle}</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply for this position at{" "}
              {job.companyName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleApply}
            >
              {isLoading ? (
                <span className="flex gap-1">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> Applying
                </span>
              ) : (
                "Apply Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Job Overview - Top Section */}
          <motion.div variants={itemVariants}>
            <Card className="mb-8 overflow-hidden border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${
                          job.companyLogo
                        } `}
                        alt="logo"
                        className="w-20 h-20 rounded-xl object-cover shadow-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
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
                          {format(new Date(job.lastDateToApply), "dd MMM YYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="text-right">
                      <p className="text-xl font-bold capitalize ">
                        Salary: {job.salary}
                      </p>
                    </div>
                    {role === "USER" && (
                      <span>
                        {jobStatus ? (
                          <Button
                            className={cn(
                              jobStatus && "bg-pending hover:bg-pending/80",
                              "py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            )}
                          >
                            Application Status: {jobStatus}
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            className="bg-brand-blue-light hover:bg-brand-blue-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            Apply Now
                          </Button>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Interview Process - TOP PRIORITY */}
              <InterviewRounds job={job} itemVariants={itemVariants} />
              {/* Eligibility Criteria - TOP PRIORITY */}
              {(job.allowedBranches.length > 0 ||
                job.allowedPassingYears.length > 0) && (
                <motion.div variants={itemVariants}>
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        Eligibility Criteria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {job.allowedBranches.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Allowed Branches
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.allowedBranches.map((branch: string) => (
                                <Badge
                                  key={branch}
                                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1.5 text-sm font-medium"
                                >
                                  {branch}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {job.allowedPassingYears.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Passing Years
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.allowedPassingYears.map((year: string) => (
                                <Badge
                                  key={year}
                                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 px-3 py-1.5 text-sm font-medium"
                                >
                                  {year}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Skills Required - MEDIUM PRIORITY */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Skills Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {job.skillsRequired.map(
                        (skill: string, index: number) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Badge
                              variant="secondary"
                              className="px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              {skill}
                            </Badge>
                          </motion.div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Job Description - MEDIUM PRIORITY */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <AnimatePresence mode="wait">
                        {job?.Description?.length > 300 &&
                        !isDescriptionExpanded ? (
                          <motion.div
                            key="collapsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <p className="text-gray-700 leading-relaxed">
                              {job.jobDescription.substring(0, 300)}...
                            </p>
                            <Button
                              variant="ghost"
                              onClick={() => setIsDescriptionExpanded(true)}
                              className="mt-3 text-brand-blue-light hover:text-brand-blue-dark"
                            >
                              <ChevronDown className="w-4 h-4 mr-1" />
                              Read More
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <p className="text-gray-700 leading-relaxed">
                              {job.jobDescription}
                            </p>
                            {job.Description > 300 && (
                              <Button
                                variant="ghost"
                                onClick={() => setIsDescriptionExpanded(false)}
                                className="mt-3 text-brand-blue-light hover:text-brand-blue-dark"
                              >
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Read Less
                              </Button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* Quick Job Info */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Experience</span>
                      <span className="font-semibold">{job.experience}</span>
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

              {/* Company Info - LOWER PRIORITY (Minimized) */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Company Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {job.companyWebsite && (
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-brand-blue-light hover:text-brand-blue-dark transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Visit Website</span>
                      </a>
                    )}
                    {job.companyEmail && (
                      <a
                        href={`mailto:${job.companyEmail}`}
                        className="flex items-center gap-2 text-brand-blue-light hover:text-brand-blue-dark transition-colors group"
                      >
                        <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Send Email</span>
                      </a>
                    )}
                    {job.companyPhone && (
                      <a
                        href={`tel:${job.companyPhone}`}
                        className="flex items-center gap-2 text-brand-blue-light hover:text-brand-blue-dark transition-colors group"
                      >
                        <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Call Now</span>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InterviewRounds({ job, itemVariants }) {
  const rounds_info = !!job?.rounds;
  console.log("Calling interview rounds", job);
  return (
    <motion.div variants={itemVariants}>
      {rounds_info && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-brand-blue-light to-brand-blue-dark rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              Interview Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-brand-blue-light to-brand-blue-dark opacity-30"></div>
              <div className="space-y-6">
                {job.rounds.map((round, index) => (
                  <motion.div
                    key={round.roundNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-4 group"
                  >
                    {/* Round Number Circle */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-gradient-to-br from-brand-blue-light to-brand-blue-dark text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
                      {round.roundNumber}
                    </div>

                    {/* Round Content */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {round.roundName}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {round.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
