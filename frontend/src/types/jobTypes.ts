export interface Job {
  id: string
  jobTitle: string
  jobDescription: string
  skillsRequired: string[]
  location: string
  salary: string
  experience: string
  jobRole: string
  jobType: string
  postedDate: string
  companyName: string
  companyWebsite: string
  companyLogo: string
  companyEmail: string
  companyPhone: string
  lastDateToApply: string
  allowedBranches: string[]
  allowedPassingYears: string[]
  rounds: {
    roundNumber: number
    roundName: string
    description: string
  }[]
}

export interface JobFilters {
  searchTitle: string
  status: string // Replace companyName with status
  salaryRange: string
  experience: string
  postedDate: string
  eligibility: string
}