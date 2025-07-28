import { z } from "zod";

const currentYear = new Date().getFullYear();

export const personalInfoSchema = z.object({
  username: z.string().min(1, "Username is required"),
  collegeId: z.string().min(1, "College ID is required"),
  email: z.string().email("Invalid email address"),
  gender: z.string().min(1, "Gender is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

export const educationSchema = z.object({
  id: z.string(),
  educationalLevel: z.string().min(1, "Educational level is required"),
  institution: z.string().min(1, "Institution is required"),
  specialization: z.string().optional().nullable(),
  boardOrUniversity: z.string().min(1, "Board/University is required"),
  percentage: z
    .number({ invalid_type_error: "Percentage must be a number" })
    .int()
    .min(0, "Percentage must be positive")
    .max(100, "Percentage cannot exceed 100"),
  passedOutYear: z
    .number({ invalid_type_error: "Year must be a number" })
    .int()
    .min(1900, "Invalid year")
    .max(currentYear + 5, `Year cannot be more than ${currentYear + 5}`),
  location: z.string().min(1, "Location is required"),
  noOfActiveBacklogs: z
    .number({ invalid_type_error: "Backlogs must be a number" })
    .int()
    .min(0, "Backlogs cannot be negative"),
});

export const educationArraySchema = z
  .array(educationSchema)
  .min(3, "At least 3 educational entries are required");

export const resumeSchema = z.object({
  resume: z
    .instanceof(File)
    .refine(
      (file) => file.type === "application/pdf",
      "Resume must be a PDF file"
    )
    .refine(
      (file) => file.size <= 1 * 1024 * 1024,
      "Resume must be less than 1MB"
    )
    .optional()
    .nullable(),
});

export const profilePicSchema = z
  .instanceof(File)
  .refine(
    (file) => file.type.startsWith("image/"),
    "Profile picture must be an image"
  )
  .refine(
    (file) => file.size <= 150 * 1024,
    "Profile picture must be less than 150KB"
  )
  .optional();
