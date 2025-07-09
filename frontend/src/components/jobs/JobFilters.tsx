import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobFilters as JobFiltersType } from "@/types/job";

interface JobFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
}

export const JobFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
}: JobFiltersProps) => {
  const handleFilterChange = (key: keyof JobFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      sector: "All Sectors",
      positionType: "All",
      status: "All",
      sortBy: "Created At",
    });
    onSearchChange("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        {/* Job Sector Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Job Sector
          </label>
          <Select
            value={filters.sector}
            onValueChange={(value) => handleFilterChange("sector", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="All Sectors">All Sectors</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Position Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Position Type
          </label>
          <Select
            value={filters.positionType}
            onValueChange={(value) => handleFilterChange("positionType", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sort by</label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="Created At">Created At</SelectItem>
              <SelectItem value="Salary">Salary</SelectItem>
              <SelectItem value="Company">Company</SelectItem>
              <SelectItem value="Experience">Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 invisible">
            Clear
          </label>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear all filters
          </Button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 invisible">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by job title or company"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
