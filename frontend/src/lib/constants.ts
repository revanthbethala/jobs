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

