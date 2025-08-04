import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export interface Job {
  id: string;
  jobTitle: string;
  jobDescription: string;
  skillsRequired: string[];
  location: string;
  salary: string;
  experience: string;
  jobRole: string;
  jobType: string;
  postedDate: string;
  companyName: string;
  companyWebsite: string;
  companyLogo: string;
  companyEmail: string;
  applications: object[];
  companyPhone: string;
  noOfVacancies: number | null | undefined;
  serviceAgreement: string | null | undefined;
  lastDateToApply: string;
  allowedBranches: string[];
  allowedPassingYears: string[];
  rounds: {
    roundNumber: number;
    roundName: string;
    description: string;
  }[];
}
export interface AppliedJob {
  id: string;
  jobId: string;
  userId: string;
  resume: string;
  status: string;
  appliedAt: string;
  currentRound: number;
  job: Job;
}

export interface JobFilters {
  searchTitle: string;
  location: string;
  status: string; // Replace companyName with status
  salaryRange: string;
  experience: string;
  jobType: string;
  postedDate: string;
  eligibility: string;
}

export interface InterviewRound {
  id: string;
  roundNumber: number;
  roundName: string;
  description: string;
}

export interface JobFormData {
  jobTitle: string;
  jobDescription: string;
  jobSector: string;
  customSector: string;
  skillsRequired: string[];
  location: string;
  salary: string;
  experience: string;
  jobRole: string;
  jobType: string;
  companyName: string;
  cptType: string;
  serviceAgreement?: string;
  numberOfVacancies?: string;
  companyWebsite: string;
  companyLogo?: File | null;
  companyEmail: string;
  companyPhone: string;
  allowedBranches: string[];
  allowedPassingYears: string[];
  lastDateToApply: Date | null;
  interviewRounds: InterviewRound[];
}

export interface AppliedJob {
  jobId: string;
  appliedAt: string;
  status: string;
}

// Props shared by all form sections in JobPosting page
export interface SectionBaseProps {
  register: UseFormRegister<JobFormData>;
  control: Control<JobFormData>;
  errors: FieldErrors<JobFormData>;
  logoUrl?: string; // Optional URL for the company logo
}

export interface JobDetailsSectionProps extends SectionBaseProps {
  showCustomSector: boolean;
}

export type CompanyInformationSectionProps = SectionBaseProps;
export type EligibilityCriteriaSectionProps = SectionBaseProps;
export type ApplicationDeadlineSectionProps = SectionBaseProps;
