import { z } from "zod";

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
  role: z.string().min(1, "Role is required"),
});

export const educationSchema = z.object({
  id: z.string(),
  educationalLevel: z.string().min(1, "Educational level is required"),
  institution: z.string().min(1, "Institution is required"),
  specialization: z.string(),
  boardOrUniversity: z.string().min(1, "Board/University is required"),
  percentage: z.string().min(1, "Percentage is required"),
  passedOutYear: z
    .number()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  location: z.string().min(1, "Location is required"),
  noOfActiveBacklogs: z.number().min(0, "Backlogs cannot be negative"),
});

export const educationArraySchema = z
  .array(educationSchema)
  .min(1, "At least one education entry is required");

export const resumeSchema = z.object({
  resume: z
    .instanceof(File, { message: "Resume is required" })
    .refine(
      (file) => file.type === "application/pdf",
      "Resume must be a PDF file"
    )
    .refine(
      (file) => file.size <= 3 * 1024 * 1024,
      "Resume must be less than 3MB"
    ),
});

export const profilePicSchema = z
  .instanceof(File)
  .refine(
    (file) => file.type.startsWith("image/"),
    "Profile picture must be an image"
  )
  .refine(
    (file) => file.size <= 2 * 1024 * 1024,
    "Profile picture must be less than 2MB"
  )
  .optional();
