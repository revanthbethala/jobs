
import { z } from 'zod';

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
  address: z.string().min(1, 'Address is required').max(200, 'Address must be less than 200 characters'),
  city: z.string().min(1, 'City is required').max(50, 'City must be less than 50 characters'),
  state: z.string().min(1, 'State is required').max(50, 'State must be less than 50 characters'),
  country: z.string().min(1, 'Country is required').max(50, 'Country must be less than 50 characters'),
  fatherName: z.string().min(1, 'Father name is required').max(50, 'Father name must be less than 50 characters'),
  motherName: z.string().min(1, 'Mother name is required').max(50, 'Mother name must be less than 50 characters'),
  profilePic: z.string().optional(),
  resume: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  educationalLevel: z.string().min(1, 'Educational level is required'),
  schoolOrCollege: z.string().min(1, 'School/College name is required').max(100, 'Name must be less than 100 characters'),
  specialization: z.string().min(1, 'Specialization is required').max(100, 'Specialization must be less than 100 characters'),
  boardOrUniversity: z.string().min(1, 'Board/University is required').max(100, 'Board/University must be less than 100 characters'),
  percentage: z.number().min(0, 'Percentage must be at least 0').max(100, 'Percentage cannot exceed 100'),
  passedOutYear: z.number().min(1950, 'Year must be after 1950').max(new Date().getFullYear() + 10, 'Year cannot be more than 10 years in the future'),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
});

export const resumeFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.type === 'application/pdf', 'Only PDF files are allowed')
    .refine((file) => file.size <= 3 * 1024 * 1024, 'File size must be less than 3MB'),
});

export const profilePhotoSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.type.startsWith('image/'), 'Only image files are allowed')
    .refine((file) => file.size <= 3 * 1024 * 1024, 'File size must be less than 3MB'),
});

export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type Education = z.infer<typeof educationSchema>;