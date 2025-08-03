import { JobFormData } from "@/schemas/jobsSchema";
import { AppliedJob, InterviewRound, Job, JobFilters } from "@/types/jobTypes";
import { create } from "zustand";

interface JobStore {
  // Form
  formData: JobFormData;
  updateField: <K extends keyof JobFormData>(
    field: K,
    value: JobFormData[K]
  ) => void;
  addInterviewRound: () => void;
  removeInterviewRound: (id: string) => void;
  updateInterviewRound: (id: string, updates: Partial<InterviewRound>) => void;
  resetForm: () => void;

  // Jobs
  jobs: Job[];
  filteredJobs: Job[];
  filters: JobFilters;
  isLoading: boolean;
  error: string | null;
  selectedJob: Job | null;
  appliedJob: AppliedJob | null;
  setJobs: (jobs: Job[]) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  clearFilters: () => void;
  setSelectedJob: (job: Job | null) => void;
  setAppliedJob: (appliedJob: AppliedJob | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  applyFilters: () => void;
}

// ---------------- Initial Data ----------------
const initialFormData: JobFormData = {
  jobTitle: "",
  jobDescription: "",
  skillsRequired: [],
  location: "",
  salary: "",
  experience: "",
  jobRole: "",
  jobType: "",
  companyName: "",
  companyWebsite: "",
  companyLogo: null,
  companyEmail: "",
  companyPhone: "",
  allowedBranches: [],
  allowedPassingYears: [],
  lastDateToApply: null,
  interviewRounds: [],
  jobSector: "",
};

const initialFilters: JobFilters = {
  searchTitle: "",
  jobType: "",
  status: "",
  salaryRange: "",
  experience: "",
  postedDate: "",
  eligibility: "",
};

// ---------------- Store ----------------
export const useJobStore = create<JobStore>((set, get) => ({
  // Form
  formData: initialFormData,

  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  addInterviewRound: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        interviewRounds: [
          ...state.formData.interviewRounds,
          {
            id: Date.now().toString(),
            roundNumber: state.formData.interviewRounds.length + 1,
            roundName: "",
            description: "",
          },
        ],
      },
    })),

  removeInterviewRound: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        interviewRounds: state.formData.interviewRounds
          .filter((round) => round.id !== id)
          .map((round, index) => ({ ...round, roundNumber: index + 1 })),
      },
    })),

  updateInterviewRound: (id, updates) =>
    set((state) => ({
      formData: {
        ...state.formData,
        interviewRounds: state.formData.interviewRounds.map((round) =>
          round.id === id ? { ...round, ...updates } : round
        ),
      },
    })),

  resetForm: () => set({ formData: initialFormData }),

  // Jobs
  jobs: [],
  filteredJobs: [],
  filters: initialFilters,
  isLoading: false,
  error: null,
  selectedJob: null,
  appliedJob: null,

  setJobs: (jobs) => {
    set({ jobs, filteredJobs: jobs });
    get().applyFilters();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  clearFilters: () => {
    set({ filters: initialFilters });
    get().applyFilters();
  },

  setSelectedJob: (job) => set({ selectedJob: job }),
  setAppliedJob: (appliedJob) => set({ appliedJob }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  applyFilters: () => {
    const { jobs, filters } = get();
    let filtered = [...jobs];

    if (filters.searchTitle) {
      filtered = filtered.filter((job) =>
        job.jobTitle.toLowerCase().includes(filters.searchTitle.toLowerCase())
      );
    }

    if (filters.status) {
      const statuses = ["pending", "accepted", "rejected"];
      filtered = filtered.filter(() => {
        const randomStatus =
          statuses[Math.floor(Math.random() * statuses.length)];
        return filters.status === "all" || randomStatus === filters.status;
      });
    }

    if (filters.salaryRange) {
      filtered = filtered.filter((job) => {
        const rawSalary = job.salary?.toUpperCase().replace(/\s/g, "") || "";
        const lowerBoundStr = rawSalary.split("-")[0];

        let salaryNum = 0;

        if (lowerBoundStr.includes("LPA")) {
          salaryNum = parseFloat(lowerBoundStr.replace("LPA", "")) * 100000;
        } else {
          salaryNum = parseFloat(lowerBoundStr) * 100000; // fallback
        }

        switch (filters.salaryRange) {
          case "0-5":
            return salaryNum <= 500000;
          case "5-10":
            return salaryNum > 500000 && salaryNum <= 1000000;
          case "10-15":
            return salaryNum > 1000000 && salaryNum <= 1500000;
          case "15+":
            return salaryNum > 1500000;
          default:
            return true;
        }
      });
    }

    if (filters.experience) {
      filtered = filtered.filter((job) => {
        const expRaw = job.experience?.toLowerCase().replace(/\s/g, "") || "";

        let expNum = 0;

        if (expRaw.includes("fresher")) {
          expNum = 0;
        } else if (expRaw.includes("-")) {
          const [low] = expRaw.split("-");
          expNum = parseFloat(low);
        } else if (expRaw.includes("+")) {
          expNum = parseFloat(expRaw.replace("+", ""));
        } else {
          expNum = parseFloat(expRaw); // e.g., "4"
        }

        switch (filters.experience) {
          case "0-1":
            return expNum <= 1;
          case "1-3":
            return expNum >= 1 && expNum <= 3;
          case "3-5":
            return expNum >= 3 && expNum <= 5;
          case "5+":
            return expNum >= 5;
          default:
            return true;
        }
      });
    }

    if (filters.postedDate) {
      const now = new Date();
      filtered = filtered.filter((job) => {
        const postedDate = new Date(job.postedDate);
        const diffTime = Math.abs(now.getTime() - postedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        switch (filters.postedDate) {
          case "7":
            return diffDays <= 7;
          case "30":
            return diffDays <= 30;
          case "90":
            return diffDays <= 90;
          default:
            return true;
        }
      });
    }
    if (filters.jobType) {
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    }

    set({ filteredJobs: filtered });
  },
}));
