import { useMemo, useCallback, memo } from "react";
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
import { postJob } from "@/services/jobServices";

// Constants - moved to top level to prevent recreation
const JOB_ROLE_OPTIONS = [
  { value: "developer", label: "Software Developer" },
  { value: "designer", label: "UI/UX Designer" },
  { value: "manager", label: "Project Manager" },
  { value: "analyst", label: "Business Analyst" },
  { value: "tester", label: "QA Tester" },
  { value: "devops", label: "DevOps Engineer" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
] as const;

const JOB_TYPE_OPTIONS = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
] as const;

const BRANCH_OPTIONS = [
  { value: "CSE", label: "CSE" },
  { value: "CSE-DATA SCIENCE", label: "CSE-DATA SCIENCE" },
  { value: "AIML", label: "AIML" },
  { value: "CSE-AIML", label: "CSE-AIML" },
  { value: "IT", label: "IT" },
  { value: "MECH", label: "MECH" },
  { value: "EEE", label: "EEE" },
  { value: "ECE", label: "ECE" },
  { value: "CSE-R", label: "CSE-R" },
] as const;

const JOB_SECTOR_OPTIONS = [
  { value: "Sales", label: "Sales" },
  { value: "IT", label: "IT" },
  { value: "Cloud Computing", label: "Cloud Computing" },
  { value: "Salesforce", label: "Salesforce" },
  { value: "DevOps", label: "DevOps" },
  { value: "Software Development", label: "Software Development" },
  { value: "Other", label: "Other" },
] as const;

const PASSING_YEAR_OPTIONS = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2019", label: "2019" },
] as const;
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
console.log("Form Data:", formData);
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
  memo(({ register, control, errors }) => (
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
  const { formData, updateField, resetForm } = useJobStore();
  const { toast } = useToast();

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

  // Watch only the specific field needed
  const jobSector = watch("jobSector");

  // Memoize conditional rendering logic
  const showCustomSector = useMemo(() => jobSector === "Other", [jobSector]);

  // Memoized submit handler
  const onSubmit = useCallback(
    async (data: JobFormData) => {
      try {
        const formData = buildFormData(data);
        console.log(`Data before request: {JSON.stringify(formData, null, 2)}`);
        const response = await postJob(formData);
        toast({
          title: "Success!",
          description: "Job posting has been created successfully.",
        });
        console.log(response);
        // reset();
        // resetForm();
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

          <CompanyInformationSection {...sectionProps} />

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
              {isSubmitting ? "Creating..." : "Create Job Posting"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};
