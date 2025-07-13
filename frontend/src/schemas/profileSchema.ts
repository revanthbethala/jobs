import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone No. is required")
    .max(10, "Please enter proper mobile number"),
  username: z.string(),
  gender: z.string().min(1, "Gender is required"),
  fatherName: z.string().min(1, "Father name is required"),
  motherName: z.string().min(1, "Mother name is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "State is required"),
  state: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});
const currentYear = new Date().getFullYear();

export const educationSchema = z.object({
  educationalLevel: z.string().min(1, "Education level is required"),
  institution: z.string().min(1, "Institution is required"),
  specialization: z.string().optional(),
  boardOrUniversity: z.string().min(1, "Board/University is required"),
  percentage: z
    .number({ invalid_type_error: "Percentage must be a number" })
    .min(0, "Percentage cannot be less than 0")
    .max(100, "Percentage cannot be more than 100"),
  passedOutYear: z
    .number({ invalid_type_error: "Passed out year must be a number" })
    // .min(1950, "Year must be 1950 or later")
    .max(currentYear + 10, `Year must not be beyond ${currentYear + 10}`),
  location: z.string().min(1, "Location is required"),
  noOfActiveBacklogs: z
    .number({ invalid_type_error: "Backlogs must be a number" })
    .min(0, "Backlogs cannot be negative")
    .default(0),
});

export const profileSchema = z.object({
  personalInfo: personalInfoSchema,
  education: z.array(educationSchema).optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
