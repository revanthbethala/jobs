export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  username?: string;
  role: 'USER' | 'ADMIN';
  profilePicture?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  resume?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  education: Education[];
}

export interface Education {
  id?: string;
  level: 'btech' | 'mtech' | 'mba' | 'bpharmacy' | 'mpharmacy' | '12th' | '10th' | 'diploma';
  institution: string;
  specialization?: string;
  board: string;
  percentage?: number;
  cgpa?: number;
  passedYear: number;
  location: string;
  backlogs?: number;
  userId?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  username?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  education: Education[];
  resume?: string;
  profilePicture?: string;
}