import { Job, JobFilters } from "@/types/jobTypes"
import { create } from "zustand"

interface JobStore {
  jobs: Job[]
  filteredJobs: Job[]
  filters: JobFilters
  isLoading: boolean
  error: string | null
  selectedJob: Job | null

  // Actions
  setJobs: (jobs: Job[]) => void
  setFilters: (filters: Partial<JobFilters>) => void
  clearFilters: () => void
  setSelectedJob: (job: Job | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  applyFilters: () => void
}

const initialFilters: JobFilters = {
  searchTitle: "",
  status: "", // Replace companyName with status
  salaryRange: "",
  experience: "",
  postedDate: "",
  eligibility: "",
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  filteredJobs: [],
  filters: initialFilters,
  isLoading: false,
  error: null,
  selectedJob: null,

  setJobs: (jobs) => {
    set({ jobs, filteredJobs: jobs })
    get().applyFilters()
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }))
    get().applyFilters()
  },

  clearFilters: () => {
    set({ filters: initialFilters })
    get().applyFilters()
  },

  setSelectedJob: (job) => set({ selectedJob: job }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  applyFilters: () => {
    const { jobs, filters } = get()
    let filtered = [...jobs]

    // Search by job title
    if (filters.searchTitle) {
      filtered = filtered.filter((job) => job.jobTitle.toLowerCase().includes(filters.searchTitle.toLowerCase()))
    }

    // Filter by status (this would typically come from user application data)
    if (filters.status) {
      // For demo purposes, we'll randomly assign statuses
      // In real implementation, this would filter based on user's application status
      filtered = filtered.filter((job) => {
        const statuses = ["pending", "accepted", "rejected"]
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
        return filters.status === "all" || randomStatus === filters.status
      })
    }

    // Rest of the filtering logic remains the same...
    // Filter by salary range
    if (filters.salaryRange) {
      filtered = filtered.filter((job) => {
        const salary = job.salary.replace(/[₹,\s]/g, "").split("-")[0]
        const salaryNum = Number.parseInt(salary)

        switch (filters.salaryRange) {
          case "0-5":
            return salaryNum <= 500000
          case "5-10":
            return salaryNum >= 500000 && salaryNum <= 1000000
          case "10-15":
            return salaryNum >= 1000000 && salaryNum <= 1500000
          case "15+":
            return salaryNum >= 1500000
          default:
            return true
        }
      })
    }

    // Filter by experience
    if (filters.experience) {
      filtered = filtered.filter((job) => {
        const exp = job.experience.toLowerCase()
        switch (filters.experience) {
          case "0-1":
            return exp.includes("0") || exp.includes("1") || exp.includes("fresher")
          case "1-3":
            return exp.includes("1") || exp.includes("2") || exp.includes("3")
          case "3-5":
            return exp.includes("3") || exp.includes("4") || exp.includes("5")
          case "5+":
            return (
              exp.includes("5+") || exp.includes("6") || exp.includes("7") || exp.includes("8") || exp.includes("9")
            )
          default:
            return true
        }
      })
    }

    // Filter by posted date
    if (filters.postedDate) {
      const now = new Date()
      filtered = filtered.filter((job) => {
        const postedDate = new Date(job.postedDate)
        const diffTime = Math.abs(now.getTime() - postedDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        switch (filters.postedDate) {
          case "7":
            return diffDays <= 7
          case "30":
            return diffDays <= 30
          case "90":
            return diffDays <= 90
          default:
            return true
        }
      })
    }

    set({ filteredJobs: filtered })
  },
}))
