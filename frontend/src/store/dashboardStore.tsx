// import { mockData } from "@/lib/constants";
// import { create } from "zustand";

// interface RoundSummary {
//   roundNumber: number;
//   roundName: string;
//   qualifiedUsers: number;
// }

// interface JobSummary {
//   jobId: string;
//   jobRole: string;
//   postedAt: string;
//   totalApplications: number;
//   totalRounds: number;
//   totalQualifiedUsersAcrossRounds: number;
//   qualificationRatio: string;
//   roundSummaries: RoundSummary[];
//   specializationCounts: Record<string, number>;
// }

// interface BtechSpecialization {
//   _count: {
//     specialization: number;
//   };
//   specialization: string;
// }

// interface DashboardState {
//   totalJobsPostedByAdmin: number;
//   totalUsers: number;
//   btechSpecializations: BtechSpecialization[];
//   jobSummaries: JobSummary[];

//   setDashboardData: (data: {
//     totalJobsPostedByAdmin: number;
//     totalUsers: number;
//     btechSpecializations: BtechSpecialization[];
//     jobSummaries: JobSummary[];
//   }) => void;
//   getJobById: (jobId: string) => JobSummary | undefined;
//   getPeakJobsDate: () => { date: string; count: number };
//   getTotalApplications: () => number;
// }

// export const useDashboardStore = create<DashboardState>((set, get) => ({
//   ...mockData,
//   setDashboardData: (data) => set(data),
//   getJobById: (jobId) => {
//     const { jobSummaries } = get();
//     return jobSummaries.find((job) => job.jobId === jobId);
//   },
//   getPeakJobsDate: () => {
//     const { jobSummaries } = get();
//     const jobsByDate = jobSummaries.reduce((acc, job) => {
//       const date = new Date(job.postedAt).toDateString();
//       acc[date] = (acc[date] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     return Object.entries(jobsByDate).reduce(
//       (max, [date, count]) => (count > max.count ? { date, count } : max),
//       { date: "", count: 0 }
//     );
//   },
//   getTotalApplications: () => {
//     const { jobSummaries } = get();
//     return jobSummaries.reduce((sum, job) => sum + job.totalApplications, 0);
//   },
// }));

import { create } from "zustand";

interface RoundSummary {
  roundNumber: number;
  roundName: string;
  qualifiedUsers: number;
}

interface JobSummary {
  jobId: string;
  jobRole: string;
  jobTitle: string;
  companyName: string;
  postedAt: string;
  totalApplications: number;
  totalRounds: number;
  totalQualifiedUsersAcrossRounds: number;
  qualificationRatio: string;
  roundSummaries: RoundSummary[];
  specializationCounts: Record<string, number>;
}

interface BtechSpecialization {
  _count: {
    specialization: number;
  };
  specialization: string;
}

interface DashboardState {
  totalJobsPostedByAdmin: number;
  totalUsers: number;
  btechSpecializations: BtechSpecialization[];
  jobSummaries: JobSummary[];
  setDashboardData: (data: {
    totalJobsPostedByAdmin: number;
    totalUsers: number;
    btechSpecializations: BtechSpecialization[];
    jobSummaries: JobSummary[];
  }) => void;
  getJobById: (jobId: string) => JobSummary | undefined;
  getPeakJobsDate: () => { date: string; count: number };
  getTotalApplications: () => number;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  totalJobsPostedByAdmin: 0,
  totalUsers: 0,
  btechSpecializations: [],
  jobSummaries: [],
  setDashboardData: (data) => set(data),
  getJobById: (jobId) => {
    const { jobSummaries } = get();
    return jobSummaries.find((job) => job.jobId === jobId);
  },
  getPeakJobsDate: () => {
    const { jobSummaries } = get();
    const jobsByDate = jobSummaries.reduce((acc, job) => {
      const date = new Date(job.postedAt).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(jobsByDate).reduce(
      (max, [date, count]) => (count > max.count ? { date, count } : max),
      { date: "", count: 0 }
    );
  },
  getTotalApplications: () => {
    const { jobSummaries } = get();
    return jobSummaries.reduce((sum, job) => sum + job.totalApplications, 0);
  },
}));
