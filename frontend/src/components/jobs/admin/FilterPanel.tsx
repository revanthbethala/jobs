import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronDown, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useUserFilterStore } from "@/store/userFiltersStore";
import useDebounce from "@/hooks/use-debounce";
import { FilterFormData, filterSchema } from "@/schemas/userFiltersSchema";
import { EDUCATION_LEVELS, GENDERS } from "@/lib/constants";
const educationalLevels = EDUCATION_LEVELS;
const genders = ["Male", "Female", "Other"];

// Generate years: past 6 years to next 6 years from current year
const currentYear = new Date().getFullYear();
const passedOutYears = Array.from(
  { length: 13 },
  (_, i) => currentYear - 6 + i
);

interface EducationalLevelFilter {
  level: string;
  percentageRange: [number, number];
}

export const FilterPanel = () => {
  const {
    filters,
    isFilterPanelOpen,
    toggleFilterPanel,
    setFilters,
    clearFilters,
  } = useUserFilterStore();
  // const [searchValue, setSearchValue] = useState(filters.search || "");
  const [selectedYears, setSelectedYears] = useState<number[]>(
    filters.passedOutYears || []
  );
  const [educationalLevelFilters, setEducationalLevelFilters] = useState<
    EducationalLevelFilter[]
  >(filters.educationalLevels || []);

  const { handleSubmit, setValue, reset } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });

  // Handle filter state synchronization
  useEffect(() => {
    reset(filters);
    // setSearchValue(filters.search || "");
    setSelectedYears(filters.passedOutYears || []);
    setEducationalLevelFilters(filters.educationalLevels || []);
  }, [filters, reset]);

  const onSubmit = (data: FilterFormData) => {
    const cleanedData: FilterFormData = {};

    // Include search if it has any value (even empty string is valid for clearing search)
    if (data.search !== undefined) {
      cleanedData.search = data.search.trim() || undefined;
    }

    // Include gender if selected
    if (data.gender) {
      cleanedData.gender = data.gender;
    }

    // Include educational level filters if any are selected
    if (educationalLevelFilters.length > 0) {
      cleanedData.educationalLevels = educationalLevelFilters;
    }

    // Include selected years if any are selected
    if (selectedYears.length > 0) {
      cleanedData.passedOutYears = selectedYears;
    }

    // Include backlog filters if they have values (including 0)
    if (
      data.minActiveBacklogs !== undefined &&
      data.minActiveBacklogs !== null &&
      data.minActiveBacklogs >= 0
    ) {
      cleanedData.minActiveBacklogs = data.minActiveBacklogs;
    }

    if (
      data.maxActiveBacklogs !== undefined &&
      data.maxActiveBacklogs !== null &&
      data.maxActiveBacklogs >= 0
    ) {
      cleanedData.maxActiveBacklogs = data.maxActiveBacklogs;
    }

    setFilters(cleanedData);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchValue("");
    setSelectedYears([]);
    setEducationalLevelFilters([]);
    reset({});
  };

  const handleYearToggle = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleAddEducationalLevel = (level: string) => {
    if (!educationalLevelFilters.some((filter) => filter.level === level)) {
      setEducationalLevelFilters((prev) => [
        ...prev,
        {
          level,
          percentageRange: [0, 100],
        },
      ]);
    }
  };

  const handleRemoveEducationalLevel = (level: string) => {
    setEducationalLevelFilters((prev) =>
      prev.filter((filter) => filter.level !== level)
    );
  };

  const handlePercentageRangeChange = (
    level: string,
    value: [number, number]
  ) => {
    setEducationalLevelFilters((prev) =>
      prev.map((filter) =>
        filter.level === level ? { ...filter, percentageRange: value } : filter
      )
    );
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(
      (value) =>
        value !== undefined &&
        value !== "" &&
        value !== 0 &&
        (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const availableEducationalLevels = educationalLevels.filter(
    (level) => !educationalLevelFilters.some((filter) => filter.level === level)
  );

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        onClick={toggleFilterPanel}
        variant="outline"
        className="mb-4 flex items-center gap-2 hover:bg-primary/10 transition-colors"
      >
        <Filter className="h-4 w-4" />
        Filters
        {getActiveFiltersCount() > 0 && (
          <Badge variant="secondary" className="ml-2">
            {getActiveFiltersCount()}
          </Badge>
        )}
      </Button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <Card className="backdrop-blur-sm bg-card/95 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Filter Users</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFilterPanel}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-6">
                    {/* Grid: Gender + Educational Level Dropdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between">
                      {/* Gender */}
                      <div className="space-y-2">
                        <Label>Gender </Label>
                        <Select
                          onValueChange={(value) =>
                            setValue(
                              "gender",
                              value as "Male" | "Female" | "Other" | undefined
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {genders.map((gender) => (
                              <SelectItem key={gender} value={gender}>
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Educational Level Dropdown */}
                      <div className="space-y-2">
                        <Label>Educational Levels</Label>
                        {availableEducationalLevels.length > 0 && (
                          <Select onValueChange={handleAddEducationalLevel}>
                            <SelectTrigger className="">
                              <SelectValue placeholder="Add Education level" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableEducationalLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>

                    {/* Grid: Educational Level Filters */}
                    {educationalLevelFilters.length > 0 && (
                      <AnimatePresence>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {educationalLevelFilters.map((filter) => (
                            <motion.div
                              key={filter.level}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border rounded-lg p-4 space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-sm">
                                  {filter.level}
                                </Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveEducationalLevel(filter.level)
                                  }
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="space-y-4">
                                <Label>
                                  Percentage Range for {filter.level}
                                </Label>
                                <div className="space-y-4">
                                  <div className="px-4">
                                    <Slider
                                      value={filter.percentageRange}
                                      onValueChange={(value) =>
                                        handlePercentageRangeChange(
                                          filter.level,
                                          value as [number, number]
                                        )
                                      }
                                      max={100}
                                      min={0}
                                      step={1}
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">
                                      {filter.percentageRange[0]}% -{" "}
                                      {filter.percentageRange[1]}%
                                    </span>
                                    <div className="flex gap-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Min: {filter.percentageRange[0]}%
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Max: {filter.percentageRange[1]}%
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </AnimatePresence>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Passed Out Years */}
                    <div className="space-y-2">
                      <Label>Passed Out Years </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {selectedYears.length > 0
                              ? `${selectedYears.length} year${
                                  selectedYears.length > 1 ? "s" : ""
                                } selected`
                              : "Select years"}
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
                            {passedOutYears.map((year) => (
                              <div
                                key={year}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`year-${year}`}
                                  checked={selectedYears.includes(year)}
                                  onCheckedChange={() => handleYearToggle(year)}
                                />
                                <Label
                                  htmlFor={`year-${year}`}
                                  className="text-sm font-normal"
                                >
                                  {year}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Active Backlogs */}
                    <div className="space-y-2">
                      <Label>Active Backlogs - Min/Max </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          min={0}
                          onChange={(e) =>
                            setValue(
                              "minActiveBacklogs",
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                        />

                        <Input
                          type="number"
                          placeholder="Max"
                          min={0}
                          onChange={(e) =>
                            setValue(
                              "maxActiveBacklogs",
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Apply Filters
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClearFilters}
                    >
                      Clear All
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
