"use client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useJobStore } from "@/store/jobStore";

interface TopFilterBarProps {
  onOpenFilters: () => void;
}

export function TopFilterBar({ onOpenFilters }: TopFilterBarProps) {
  const { filters, setFilters, clearFilters, filteredJobs } = useJobStore();

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  const handleSearchChange = (value: string) => {
    setFilters({ searchTitle: value });
  };

  const handleClearSearch = () => {
    setFilters({ searchTitle: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search jobs by title..."
              value={filters.searchTitle}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 h-11 border-gray-300 focus:border-brand-blue-light focus:ring-brand-blue-light/20"
            />
            {filters.searchTitle && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Button and Results */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-sm text-gray-600 font-medium">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
              found
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Badge
                    variant="secondary"
                    className="bg-brand-blue-light/10 text-brand-blue-dark border-brand-blue-light/20"
                  >
                    {activeFiltersCount} filter
                    {activeFiltersCount !== 1 ? "s" : ""}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                  >
                    Clear
                  </Button>
                </motion.div>
              )}

              <Button
                onClick={onOpenFilters}
                variant="outline"
                className="relative h-11 px-4 border-gray-300 hover:border-brand-blue-light hover:bg-brand-blue-light/5 transition-all duration-200 bg-transparent"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-brand-blue-light rounded-full"
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
