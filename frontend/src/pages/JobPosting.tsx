import { useMemo, useCallback, memo, useEffect } from "react";
import {
  useForm,
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  Building,
  Users,
  Calendar,
  RotateCcw,
  Send,
} from "lucide-react";
import {
  JobFormData,
  JobDetailsSectionProps,
  CompanyInformationSectionProps,
  EligibilityCriteriaSectionProps,
  ApplicationDeadlineSectionProps,
} from "@/types/jobTypes";
import { useJobStore } from "@/store/jobStore";
import { jobFormSchema } from "@/schemas/jobsSchema";
import { TextInput } from "@/components/jobs/admin/postjobs/TextInput";
import { SelectInput } from "@/components/jobs/admin/postjobs/SelectInput";
import { TextArea } from "@/components/jobs/admin/postjobs/TextArea";
import { TagsInput } from "@/components/jobs/admin/postjobs/TagsInput";
import { MultiSelectInput } from "@/components/jobs/admin/postjobs/MultiSelectInput";
import { DateInput } from "@/components/jobs/admin/postjobs/DateInput";
import InterviewRounds from "@/components/jobs/admin/postjobs/InterviewRounds";
import { FileInput } from "@/components/jobs/admin/postjobs/FileInput";
import { getJobById, postJob, updateJob } from "@/services/jobServices";
import {
  JOB_ROLE_OPTIONS,
  JOB_TYPE_OPTIONS,
  JOB_SECTOR_OPTIONS,
  BRANCH_OPTIONS,
  PASSING_YEAR_OPTIONS,
} from "@/lib/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// Constants - moved to top level to prevent recreation

const buildFormData = (data: JobFormData): FormData => {
  const {
    interviewRounds,
    companyLogo,
    lastDateToApply,
    skillsRequired,
    allowedBranches,
    allowedPassingYears,
    ...rest
  } = data;
  const formData = new FormData();

  // Handle file upload
  if (companyLogo instanceof File) {
    formData.append("companyLogo", companyLogo);
  }

  // Handle date
  if (lastDateToApply) {
    formData.append("lastDateToApply", lastDateToApply.toISOString());
  }

  // Handle interview rounds - send as JSON string for backend parsing
  const interviewRoundsArray = Array.isArray(interviewRounds)
    ? interviewRounds.map((round) => ({
        roundNumber: round.roundNumber,
        roundName: round.roundName,
        description: round.description,
      }))
    : [];
  formData.append("rounds", JSON.stringify(interviewRoundsArray));

  // Handle skillsRequired - send as JSON string for backend parsing
  if (skillsRequired && skillsRequired.length > 0) {
    formData.append("skillsRequired", skillsRequired.join(","));
  }

  // Handle allowedBranches – send each item separately

  if (allowedBranches && allowedBranches.length > 0) {
    formData.append("allowedBranches", allowedBranches.join(","));
  }

  // Handle allowedPassingYears – send each year separately
  if (allowedPassingYears && allowedPassingYears.length > 0) {
    formData.append("allowedPassingYears", allowedPassingYears.join(","));
  }

  // Handle regular fields
  Object.entries(rest).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, String(value));
  });
  return formData;
};

// Memoized Components
const JobDetailsSection: React.FC<JobDetailsSectionProps> = memo(
  ({ register, control, errors, showCustomSector }) => (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Job Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Job Title"
            placeholder="e.g., Senior Software Developer"
            registration={register("jobTitle")}
            error={errors.jobTitle?.message}
            required
          />
          <SelectInput
            label="Job Role"
            options={JOB_ROLE_OPTIONS}
            registration={register("jobRole")}
            error={errors.jobRole?.message}
            required
          />
        </div>

        <TextArea
          label="Job Description"
          placeholder="Describe the role, responsibilities, and requirements..."
          registration={register("jobDescription")}
          error={errors.jobDescription?.message}
          rows={6}
          required
        />

        <TagsInput
          label="Skills Required"
          placeholder="Add skills and press Enter"
          name="skillsRequired"
          control={control}
          error={errors.skillsRequired?.message}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextInput
            label="Location"
            placeholder="e.g., New York, NY"
            registration={register("location")}
            error={errors.location?.message}
            required
          />
          <TextInput
            label="Salary"
            placeholder="e.g., $80,000 - $120,000"
            registration={register("salary")}
            error={errors.salary?.message}
            required
          />
          <TextInput
            label="Experience Required"
            placeholder="e.g., 3-5 years"
            registration={register("experience")}
            error={errors.experience?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Job Type"
            options={JOB_TYPE_OPTIONS}
            registration={register("jobType")}
            error={errors.jobType?.message}
            required
          />
          <SelectInput
            label="Job Sector"
            options={JOB_SECTOR_OPTIONS}
            registration={register("jobSector")}
            error={errors.jobSector?.message}
            required
          />
        </div>

        {showCustomSector && (
          <TextInput
            label="Custom Sector"
            placeholder="Enter custom sector name"
            registration={register("customSector")}
            error={errors.customSector?.message}
            required
          />
        )}
      </CardContent>
    </Card>
  )
);

const CompanyInformationSection: React.FC<CompanyInformationSectionProps> =
  memo(({ register, control, errors, logoUrl }) => (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Company Name"
            placeholder="e.g., Tech Solutions Inc."
            registration={register("companyName")}
            error={errors.companyName?.message}
            required
          />
          <TextInput
            label="Company Website"
            placeholder="https://www.company.com"
            registration={register("companyWebsite")}
            error={errors.companyWebsite?.message}
            type="url"
          />
        </div>

        <FileInput
          label="Company Logo"
          name="companyLogo"
          control={control}
          previewUrl={logoUrl} // Assuming this is the base URL for your uploads
          error={errors.companyLogo?.message}
          accept="image/*"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Company Email"
            placeholder="hr@company.com"
            registration={register("companyEmail")}
            error={errors.companyEmail?.message}
            type="email"
            required
          />
          <TextInput
            label="Company Phone"
            placeholder="+1 (555) 123-4567"
            registration={register("companyPhone")}
            error={errors.companyPhone?.message}
            type="tel"
            required
          />
        </div>
      </CardContent>
    </Card>
  ));

const EligibilityCriteriaSection: React.FC<EligibilityCriteriaSectionProps> =
  memo(({ control, errors }) => (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Eligibility Criteria
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <MultiSelectInput
          label="Allowed Branches"
          options={BRANCH_OPTIONS}
          name="allowedBranches"
          control={control}
          error={errors.allowedBranches?.message}
          required
        />

        <MultiSelectInput
          label="Allowed Passing Years"
          options={PASSING_YEAR_OPTIONS}
          name="allowedPassingYears"
          control={control}
          error={errors.allowedPassingYears?.message}
          required
        />
      </CardContent>
    </Card>
  ));

const ApplicationDeadlineSection: React.FC<ApplicationDeadlineSectionProps> =
  memo(({ control, errors }) => (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Application Deadline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DateInput
          label="Last Date to Apply"
          name="lastDateToApply"
          control={control}
          error={errors.lastDateToApply?.message}
          required
        />
      </CardContent>
    </Card>
  ));

// Set display names for debugging
JobDetailsSection.displayName = "JobDetailsSection";
CompanyInformationSection.displayName = "CompanyInformationSection";
EligibilityCriteriaSection.displayName = "EligibilityCriteriaSection";
ApplicationDeadlineSection.displayName = "ApplicationDeadlineSection";

// Main Component
export const JobPostingForm = () => {
  const { jobId } = useParams();
  const { data: jobData, isLoading,refetch } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
    enabled: !!jobId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity, // data never becomes stale
  });

  const { formData, resetForm } = useJobStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: formData,
    mode: "onSubmit",
  });
  useEffect(() => {
    if (jobData) {
      reset({
        ...jobData,
        lastDateToApply: jobData.lastDateToApply
          ? new Date(jobData.lastDateToApply)
          : undefined,
        allowedBranches: jobData.allowedBranches || [],
        allowedPassingYears: (jobData.allowedPassingYears || []).map(String),
        skillsRequired: jobData.skillsRequired || [],
        interviewRounds: jobData.rounds || [],
      });
    }
  }, [jobData, reset]);
  // Watch only the specific field needed
  const jobSector = watch("jobSector");

  // Memoize conditional rendering logic
  const showCustomSector = useMemo(() => jobSector === "Other", [jobSector]);

  // Memoized submit handler
  const onSubmit = useCallback(
    async (data: JobFormData) => {
      try {
        const formData = buildFormData(data);
        if (jobId) {
          console.log("hello update");
          const response = await updateJob(formData, jobId);
          toast({
            title: "Success!",
            description: "Job has been updated successfully.",
          });
          console.log("Update response:", response);
          refetch()
        } else {
          console.log("Hello post");
          const response = await postJob(formData);
          toast({
            title: "Success!",
            description: "Job posting has been created successfully.",
          });
          console.log("Post response:", response);
        }
        navigate("/posted-jobs");
        reset();
        resetForm();
      } catch (error) {
        console.error("Error creating job posting:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to create job posting. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast, reset, resetForm]
  );

  const handleReset = useCallback(() => {
    reset();
    resetForm();
    toast({
      title: "Form Reset",
      description: "All form data has been cleared.",
    });
  }, [reset, resetForm, toast]);

  // Memoized form props to prevent unnecessary re-renders
  const sectionProps = useMemo(
    () => ({
      register,
      control,
      errors,
    }),
    [register, control, errors]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Create Job Posting
          </h1>
          <p className="text-lg text-muted-foreground">
            Fill out the details below to create a comprehensive job posting
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <JobDetailsSection
            {...sectionProps}
            showCustomSector={showCustomSector}
          />

          <CompanyInformationSection
            {...sectionProps}
            logoUrl={
              jobData?.companyLogo
                ? `${import.meta.env.VITE_BACKEND_URL}${jobData.companyLogo}`
                : undefined
            }
          />

          <EligibilityCriteriaSection {...sectionProps} />

          <ApplicationDeadlineSection {...sectionProps} />

          <InterviewRounds control={control} errors={errors} />

          <footer className="flex flex-col sm:flex-row gap-4 justify-end animate-fade-in-up">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <RotateCcw className="w-4 h-4" />
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 gradient-bg"
            >
              <Send className="w-4 h-4" />
              {isSubmitting
                ? jobId
                  ? "Updating..."
                  : "Creating..."
                : jobId
                ? "Update Job"
                : "Create Job Posting"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};
