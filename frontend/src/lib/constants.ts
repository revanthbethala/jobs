export const EDUCATION_LEVELS = [
  "10th",
  "12th",
  "Diploma",
  "B.Tech",
  "M.Tech",
  "MBA",
  "Pharmacy B",
  "M.Pharmacy",
  "Pharm.D",
];

export const SPECIALIZATIONS = {
  "10th": [],
  "12th": ["MPC", "BiPC", "MEC", "HEC"],
  Diploma: [
    "CSE",
    "CSE-DATA SCIENCE",
    "CSE-AIML",
    "AIML",
    "MECH",
    "CIVIL",
    "ECE",
    "EEE",
  ],
  "B.Tech": [
    "CSE",
    "CSE-DATA SCIENCE",
    "CSE-AIML",
    "AIML",
    "MECH",
    "CIVIL",
    "ECE",
    "EEE",
  ],
  "M.Tech": [
    "CSE",
    "CSE-DATA SCIENCE",
    "CSE-AIML",
    "AIML",
    "MECH",
    "CIVIL",
    "ECE",
    "EEE",
  ],
  MBA: [],
  "Pharmacy B": [],
  "M.Pharmacy": [],
  "Pharm.D": [],
};

export const GENDERS = ["Male", "Female", "Others"];

export const JOB_ROLE_OPTIONS = [
  { value: "developer", label: "Software Developer" },
  { value: "designer", label: "UI/UX Designer" },
  { value: "manager", label: "Project Manager" },
  { value: "analyst", label: "Business Analyst" },
  { value: "tester", label: "QA Tester" },
  { value: "devops", label: "DevOps Engineer" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
];

export const JOB_TYPE_OPTIONS = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

export const BRANCH_OPTIONS = [
  { value: "CSE", label: "CSE" },
  { value: "CSE-DATA SCIENCE", label: "CSE-DATA SCIENCE" },
  { value: "AIML", label: "AIML" },
  { value: "CSE-AIML", label: "CSE-AIML" },
  { value: "IT", label: "IT" },
  { value: "MECH", label: "MECH" },
  { value: "EEE", label: "EEE" },
  { value: "ECE", label: "ECE" },
  { value: "CSE-R", label: "CSE-R" },
];

export const JOB_SECTOR_OPTIONS = [
  { value: "Sales", label: "Sales" },
  { value: "IT", label: "IT" },
  { value: "Cloud Computing", label: "Cloud Computing" },
  { value: "Salesforce", label: "Salesforce" },
  { value: "DevOps", label: "DevOps" },
  { value: "Software Development", label: "Software Development" },
  { value: "Other", label: "Other" },
];

const currentYear = new Date().getFullYear();

export const PASSING_YEAR_OPTIONS = Array.from(
  { length: 10 }, // past 6 + current + next 5
  (_, i) => {
    const year = currentYear - 4 + i;
    return { value: year.toString(), label: year.toString() };
  }
);
export const cptEligibility = [
  { value: "CPT", label: "CPT" },
  { value: "NON_CPT", label: "NON_CPT" },
  { value: "BOTH", label: "BOTH" },
];

export const mockData = {
  totalJobsPostedByAdmin: 8,
  totalUsers: 156,
  btechSpecializations: [
    {
      _count: {
        specialization: 45,
      },
      specialization: "CSE-DATA SCIENCE",
    },
    {
      _count: {
        specialization: 32,
      },
      specialization: "CSE-ARTIFICIAL INTELLIGENCE",
    },
    {
      _count: {
        specialization: 28,
      },
      specialization: "CSE-CYBER SECURITY",
    },
    {
      _count: {
        specialization: 25,
      },
      specialization: "CSE-SOFTWARE ENGINEERING",
    },
    {
      _count: {
        specialization: 26,
      },
      specialization: "CSE-GENERAL",
    },
  ],
  jobSummaries: [
    {
      jobId: "654adbd3-30c6-4264-a073-4744862ccf77",
      jobRole: "Full Stack Developer",
      postedAt: "2025-07-21T09:36:59.729Z",
      totalApplications: 24,
      totalRounds: 3,
      totalQualifiedUsersAcrossRounds: 8,
      qualificationRatio: "33.33%",
      roundSummaries: [
        {
          roundNumber: 1,
          roundName: "Technical Round",
          qualifiedUsers: 15,
        },
        {
          roundNumber: 2,
          roundName: "System Design",
          qualifiedUsers: 12,
        },
        {
          roundNumber: 3,
          roundName: "HR Round",
          qualifiedUsers: 8,
        },
      ],
      specializationCounts: {
        "CSE-DATA SCIENCE": 8,
        "CSE-SOFTWARE ENGINEERING": 6,
        "CSE-GENERAL": 5,
        "CSE-ARTIFICIAL INTELLIGENCE": 5,
      },
    },
    {
      jobId: "59b56d69-5dd1-4279-ba7e-974af63221cb",
      jobRole: "Frontend Developer",
      postedAt: "2025-07-21T10:15:30.000Z",
      totalApplications: 18,
      totalRounds: 2,
      totalQualifiedUsersAcrossRounds: 6,
      qualificationRatio: "33.33%",
      roundSummaries: [
        {
          roundNumber: 1,
          roundName: "Technical Assessment",
          qualifiedUsers: 12,
        },
        {
          roundNumber: 2,
          roundName: "Code Review",
          qualifiedUsers: 6,
        },
      ],
      specializationCounts: {
        "CSE-SOFTWARE ENGINEERING": 7,
        "CSE-GENERAL": 4,
        "CSE-DATA SCIENCE": 4,
        "CSE-ARTIFICIAL INTELLIGENCE": 3,
      },
    },
    {
      jobId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      jobRole: "Backend Developer",
      postedAt: "2025-07-21T14:30:00.000Z",
      totalApplications: 32,
      totalRounds: 3,
      totalQualifiedUsersAcrossRounds: 10,
      qualificationRatio: "31.25%",
      roundSummaries: [
        {
          roundNumber: 1,
          roundName: "Coding Challenge",
          qualifiedUsers: 20,
        },
        {
          roundNumber: 2,
          roundName: "System Architecture",
          qualifiedUsers: 15,
        },
        {
          roundNumber: 3,
          roundName: "Final Interview",
          qualifiedUsers: 10,
        },
      ],
      specializationCounts: {
        "CSE-DATA SCIENCE": 12,
        "CSE-SOFTWARE ENGINEERING": 8,
        "CSE-GENERAL": 7,
        "CSE-ARTIFICIAL INTELLIGENCE": 5,
      },
    },
    {
      jobId: "xyz789-abc123-def456-ghi789",
      jobRole: "DevOps Engineer",
      postedAt: "2025-07-22T09:00:00.000Z",
      totalApplications: 15,
      totalRounds: 2,
      totalQualifiedUsersAcrossRounds: 5,
      qualificationRatio: "33.33%",
      roundSummaries: [
        {
          roundNumber: 1,
          roundName: "Technical Interview",
          qualifiedUsers: 8,
        },
        {
          roundNumber: 2,
          roundName: "Practical Assessment",
          qualifiedUsers: 5,
        },
      ],
      specializationCounts: {
        "CSE-CYBER SECURITY": 6,
        "CSE-SOFTWARE ENGINEERING": 4,
        "CSE-GENERAL": 3,
        "CSE-DATA SCIENCE": 2,
      },
    },
    {
      jobId: "mobile-dev-001",
      jobRole: "Mobile App Developer",
      postedAt: "2025-07-23T11:45:00.000Z",
      totalApplications: 22,
      totalRounds: 3,
      totalQualifiedUsersAcrossRounds: 7,
      qualificationRatio: "31.82%",
      roundSummaries: [
        {
          roundNumber: 1,
          roundName: "App Development Challenge",
          qualifiedUsers: 14,
        },
        {
          roundNumber: 2,
          roundName: "UI/UX Review",
          qualifiedUsers: 10,
        },
        {
          roundNumber: 3,
          roundName: "Technical Discussion",
          qualifiedUsers: 7,
        },
      ],
      specializationCounts: {
        "CSE-SOFTWARE ENGINEERING": 9,
        "CSE-GENERAL": 6,
        "CSE-DATA SCIENCE": 4,
        "CSE-ARTIFICIAL INTELLIGENCE": 3,
      },
    },
    {
      jobId: "data-scientist-role",
      jobRole: "Data Scientist",
      postedAt: "2025-07-25T08:30:00.000Z",
      totalApplications: 28,
      totalRounds: 4,
      totalQualifiedUsersAcrossRounds: 6,
      qualificationRatio: "21.43%",
      roundSummaries: [
        {
          roundNumber: 1,
          roundName: "Data Analysis Test",
          qualifiedUsers: 18,
        },
        {
          roundNumber: 2,
          roundName: "Machine Learning Challenge",
          qualifiedUsers: 12,
        },
        {
          roundNumber: 3,
          roundName: "Presentation Round",
          qualifiedUsers: 8,
        },
        {
          roundNumber: 4,
          roundName: "Final Interview",
          qualifiedUsers: 6,
        },
      ],
      specializationCounts: {
        "CSE-DATA SCIENCE": 20,
        "CSE-ARTIFICIAL INTELLIGENCE": 5,
        "CSE-GENERAL": 2,
        "CSE-SOFTWARE ENGINEERING": 1,
      },
    },
  ],
};
