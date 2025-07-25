export interface PersonalInfo {
  username: string;
  collegeId: string;
  email: string;
  gender: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  fatherName: string;
  motherName: string;
  city: string;
  state: string;
  country: string;
  profilePic: File | null;
  role: string;
}

export interface Education {
  id: string;
  educationalLevel: string;
  institution: string;
  specialization: string | null;
  boardOrUniversity: string;
  percentage: number;
  passedOutYear: number;
  location: string;
  noOfActiveBacklogs: number;
}
