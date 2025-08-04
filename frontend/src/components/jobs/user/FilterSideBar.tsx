"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useJobStore } from "@/store/jobStore";
import { JOB_TYPE_OPTIONS, LOCATIONS } from "@/lib/constants";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const { filters, setFilters, clearFilters, filteredJobs, jobs } =
    useJobStore();

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full  bg-white sm:w-96  z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className=" border-b border-gray-200 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-brand-blue-light to-brand-blue-dark rounded-lg">
                      <Filter className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Filters
                      </h2>
                      <p className="text-sm text-gray-600">
                        {filteredJobs.length} jobs found
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Filter Content */}
              <div className="flex-1 p-6 space-y-6">
                {/* Salary Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Salary Range (LPA)
                  </Label>
                  <Select
                    value={filters.salaryRange}
                    onValueChange={(value) =>
                      handleFilterChange("salaryRange", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-gray-300 focus:border-brand-blue-light">
                      <SelectValue placeholder="Select salary range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ranges</SelectItem>
                      <SelectItem value="0-5">₹0 - ₹5 LPA</SelectItem>
                      <SelectItem value="5-10">₹5 - ₹10 LPA</SelectItem>
                      <SelectItem value="10-15">₹10 - ₹15 LPA</SelectItem>
                      <SelectItem value="15+">₹15+ LPA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                    Experience Level
                  </Label>
                  <Select
                    value={filters.experience}
                    onValueChange={(value) =>
                      handleFilterChange("experience", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-gray-300 focus:border-brand-blue-light">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Experience</SelectItem>
                      <SelectItem value="0-1">0 - 1 years (Fresher)</SelectItem>
                      <SelectItem value="1-3">1 - 3 years (Junior)</SelectItem>
                      <SelectItem value="3-5">
                        3 - 5 years (Mid-level)
                      </SelectItem>
                      <SelectItem value="5+">5+ years (Senior)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Job Type
                  </Label>
                  <Select
                    value={filters.jobType}
                    onValueChange={(value) =>
                      handleFilterChange("jobType", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-gray-300 focus:border-brand-blue-light">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPE_OPTIONS.map((jobType) => (
                        <SelectItem className="" value={jobType.value}>
                          {jobType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Location
                  </Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) =>
                      handleFilterChange("location", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-gray-300 focus:border-brand-blue-light">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem className="" value={job?.location}>
                          {job?.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Posted Date
                  </Label>
                  <Select
                    value={filters.postedDate}
                    onValueChange={(value) =>
                      handleFilterChange("postedDate", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-gray-300 focus:border-brand-blue-light">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Eligibility Filter */}
                {/* <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    Eligibility
                  </Label>
                  <Select
                    value={filters.eligibility}
                    onValueChange={(value) => handleFilterChange("eligibility", value)}
                  >
                    <SelectTrigger className="h-11 border-gray-300 focus:border-brand-blue-light">
                      <SelectValue placeholder="Select eligibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      <SelectItem value="fresher">Fresher Friendly</SelectItem>
                      <SelectItem value="experienced">Experienced Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Active Filters Display */}
                {Object.values(filters).some(Boolean) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm font-semibold text-gray-900">
                      Active Filters
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (!value || value === "all") return null;
                        return (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="bg-brand-blue-light/10 text-brand-blue-dark border-brand-blue-light/20 px-3 py-1"
                          >
                            {value}
                            <button
                              onClick={() => handleFilterChange(key, "")}
                              className="ml-2 hover:text-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="  border-t border-gray-200 p-6 space-y-3">
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All Filters
                </Button>
                <Button
                  onClick={onClose}
                  className="w-full h-11 bg-gradient-to-r from-brand-blue-light to-brand-blue-dark hover:from-brand-blue-dark hover:to-brand-blue-light transition-all duration-200"
                >
                  Apply Filters ({filteredJobs.length} jobs)
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
