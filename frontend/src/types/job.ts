
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
  companyPhone: string;
  lastDateToApply: string;
  rounds: JobRound[];
}

export interface JobRound {
  id: string;
  jobId: string;
  roundNumber: number;
  roundName: string;
  description: string;
}

export interface JobFilters {
  sector: string;
  positionType: string;
  status: string;
  sortBy: string;
}