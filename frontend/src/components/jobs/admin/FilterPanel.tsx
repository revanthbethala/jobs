import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, Trash2, Check } from "lucide-react";
import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";

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

import { FilterFormData, filterSchema } from "@/schemas/userFiltersSchema";
import { EDUCATION_LEVELS, SPECIALIZATIONS, GENDERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUserFiltersStore } from "@/store/userFiltersStore";

const educationalLevels = EDUCATION_LEVELS;
const genders = GENDERS;
const currentYear = new Date().getFullYear();
const passedOutYears = Array.from(
  { length: 13 },
  (_, i) => currentYear - 6 + i
);

export interface EducationalLevelFilter {
  level: string;
  specialization?: string[];
  percentageRange: [number, number];
  gradeSystem?: "Percentage";
  hasBacklogs?: boolean;
}
const FilterPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [educationalLevelFilters, setEducationalLevelFilters] = useState<
    EducationalLevelFilter[]
  >([]);

  const { handleSubmit, reset, control } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {},
  });

  const togglePanel = () => setIsOpen((prev) => !prev);

  const onSubmit = (data: FilterFormData) => {
    const cleanedData: FilterFormData = {};

    if (data.search?.trim()) {
      cleanedData.search = data.search.trim();
    }
    if (data.gender) cleanedData.gender = data.gender;
    if (educationalLevelFilters.length > 0)
      cleanedData.educationalLevels = educationalLevelFilters;
    if (selectedYears.length > 0) cleanedData.passedOutYears = selectedYears;
    if (typeof data.minActiveBacklogs === "number")
      cleanedData.minActiveBacklogs = data.minActiveBacklogs;
    if (typeof data.maxActiveBacklogs === "number")
      cleanedData.maxActiveBacklogs = data.maxActiveBacklogs;

    console.log("Selected Filters:", cleanedData);
    useUserFiltersStore.getState().setFilters({
      ...data,
      page: 1, // Reset to page 1 when filters change
    });
  };

  const handleClearFilters = () => {
    setSelectedYears([]);
    setEducationalLevelFilters([]);
    reset({
      minActiveBacklogs: undefined,
      gender: undefined,
      maxActiveBacklogs: undefined,
      search: undefined,
    });
  };

  const handleYearToggle = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleAddEducationalLevel = (level: string) => {
    if (!educationalLevelFilters.some((f) => f.level === level)) {
      setEducationalLevelFilters((prev) => [
        ...prev,
        { level, percentageRange: [0, 100], specialization: [] },
      ]);
    }
  };

  const handleRemoveEducationalLevel = (level: string) => {
    setEducationalLevelFilters((prev) => prev.filter((f) => f.level !== level));
  };

  const handlePercentageRangeChange = (
    level: string,
    value: [number, number]
  ) => {
    setEducationalLevelFilters((prev) =>
      prev.map((f) =>
        f.level === level ? { ...f, percentageRange: value } : f
      )
    );
  };

  const toggleSpecialization = (level: string, spec: string) => {
    setEducationalLevelFilters((prev) =>
      prev.map((f) => {
        if (f.level !== level) return f;
        const specs = f.specialization || [];
        const exists = specs.includes(spec);
        return {
          ...f,
          specialization: exists
            ? specs.filter((s) => s !== spec)
            : [...specs, spec],
        };
      })
    );
  };

  const availableEducationalLevels = educationalLevels.filter(
    (level) => !educationalLevelFilters.some((f) => f.level === level)
  );

  return (
    <div className="relative">
      <Button
        onClick={togglePanel}
        variant="outline"
        className="mb-4 flex items-center gap-2 hover:bg-primary/10 transition-colors"
      >
        <Filter className="h-4 w-4" />
        Filters
      </Button>

      <AnimatePresence>
        {isOpen && (
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
                    onClick={togglePanel}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Controller
                        control={control}
                        name="gender"
                        render={({ field }) => (
                          <Select
                            key={field.value ?? "empty"}
                            onValueChange={field.onChange}
                            value={field.value}
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
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Educational Levels</Label>
                      {availableEducationalLevels.length > 0 && (
                        <Select onValueChange={handleAddEducationalLevel}>
                          <SelectTrigger>
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

                  {educationalLevelFilters.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {educationalLevelFilters.map((filter) => (
                        <div
                          key={filter.level}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{filter.level}</Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveEducationalLevel(filter.level)
                              }
                              className="h-8 w-8 p-0 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div>
                            <Label>Percentage Range</Label>
                            <Slider.Root
                              className="relative flex items-center select-none touch-none w-full h-6"
                              min={0}
                              max={100}
                              step={1}
                              value={filter.percentageRange}
                              onValueChange={(range) =>
                                handlePercentageRangeChange(
                                  filter.level,
                                  range as [number, number]
                                )
                              }
                            >
                              <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
                                <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                              </Slider.Track>
                              <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow" />
                              <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow" />
                            </Slider.Root>

                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">
                                Min: {filter.percentageRange[0]}%
                              </Badge>
                              <Badge variant="outline">
                                Max: {filter.percentageRange[1]}%
                              </Badge>
                            </div>
                          </div>

                          {SPECIALIZATIONS[filter.level]?.length > 0 && (
                            <div className="space-y-2">
                              <Label>Specializations</Label>
                              <Select>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select specializations" />
                                </SelectTrigger>
                                <SelectContent>
                                  {SPECIALIZATIONS[filter.level].map((spec) => {
                                    const isSelected =
                                      filter.specialization?.includes(spec);
                                    return (
                                      <button
                                        type="button"
                                        key={spec}
                                        className={cn(
                                          "flex w-full items-center px-2 py-1.5 text-sm hover:bg-muted",
                                          isSelected && "bg-muted"
                                        )}
                                        onClick={() =>
                                          toggleSpecialization(
                                            filter.level,
                                            spec
                                          )
                                        }
                                      >
                                        <span className="flex-grow text-left">
                                          {spec}
                                        </span>
                                        {isSelected && (
                                          <Check className="h-4 w-4" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {filter.specialization?.map((spec) => (
                                  <Badge key={spec} variant="secondary">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Passed Out Years</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {selectedYears.length > 0
                              ? `${selectedYears.length} year(s) selected`
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

                    <div className="space-y-2">
                      <Label>Active Backlogs - Min/Max</Label>
                      <div className="flex gap-2">
                        <Controller
                          control={control}
                          name="minActiveBacklogs"
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Min"
                              min={0}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value)
                                )
                              }
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="maxActiveBacklogs"
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Max"
                              min={0}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value)
                                )
                              }
                            />
                          )}
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
export default FilterPanel