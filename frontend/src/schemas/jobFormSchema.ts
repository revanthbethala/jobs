import { z } from "zod";

export const interviewRoundSchema = z.object({
  id: z.string(),
  roundNumber: z.number().min(1),
  roundName: z.string().min(1, "Round name is required"),
  description: z.string().min(1, "Description is required"),
});

export const jobFormSchema = z.object({
  // Job Details
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters"),
  skillsRequired: z.array(z.string()).min(1, "At least one skill is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().min(1, "Salary is required"),
  experience: z.string().min(1, "Experience is required"),
  jobRole: z.string().min(1, "Job role is required"),
  jobType: z.string().min(1, "Job type is required"),
  jobSector: z.string().min(1, "Job sector is required"),
  customSector: z.string().optional(),

  // Company Information
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  companyLogo: z.instanceof(File).optional().nullable(),
  companyEmail: z.string().email("Please enter a valid email"),
  companyPhone: z.string().min(10, "Please enter a valid phone number"),

  // Eligibility Criteria
  allowedBranches: z
    .array(z.string())
    .min(1, "At least one branch must be selected"),
  allowedPassingYears: z
    .array(z.string())
    .min(1, "At least one passing year must be selected"),
  // cptEligibility: z.string(), // <-- Add this line

  // Last Date to Apply
  lastDateToApply: z.date({ required_error: "Last date to apply is required" }),

  // Interview Rounds
  interviewRounds: z
    .array(interviewRoundSchema)
    .min(1, "At least one interview round is required"),
  cptType: z.enum(["CPT", "NON_CPT", "BOTH"], {
    required_error: "Please select CPT type",
  }),
  numberOfVacancies: z.string().optional(),
  serviceAgreement: z.string().optional(),
});

export type JobFormData = z.infer<typeof jobFormSchema>;
