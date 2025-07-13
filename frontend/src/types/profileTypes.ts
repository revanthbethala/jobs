export interface ProfileData {
  id: string;
  isVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  username: string;
  role: "USER" | "ADMIN";
  fatherName: string;
  motherName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  profilePicture: string;
  resume: string;
  education: EducationItem[];
}

export interface EducationItem {
  id?: string;
  educationalLevel?: string;
  institution: string;
  specialization?: string;
  board: string;
  percentage?: string;
  passedOutYear: string;
  location: string;
  activeBacklogs: number;
}
