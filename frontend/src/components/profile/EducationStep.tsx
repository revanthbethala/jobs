import { useState } from "react";

import { EDUCATION_LEVELS, SPECIALIZATIONS } from "@/lib/constants";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { educationArraySchema } from "@/schemas/profileSchema";
import { useProfileStore } from "@/store/profileStore";
import { Education } from "@/types/profileTypes";

export function EducationStep() {
  const { tempEducation, updateEducation, setCurrentStep } = useProfileStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addEducationEntry = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      educationalLevel: "",
      institution: "",
      specialization: "",
      boardOrUniversity: "",
      percentage: "",
      passedOutYear: new Date().getFullYear(),
      location: "",
      noOfActiveBacklogs: 0,
    };
    updateEducation([...tempEducation, newEducation]);
  };

  const removeEducationEntry = (id: string) => {
    updateEducation(tempEducation.filter((edu) => edu.id !== id));
  };

  const updateEducationEntry = (
    id: string,
    field: string,
    value: string | number
  ) => {
    const updatedEducation = tempEducation.map((edu) => {
      if (edu.id === id) {
        const updated = { ...edu, [field]: value };
        // Reset specialization if education level changes
        if (field === "educationalLevel") {
          updated.specialization = "";
        }
        return updated;
      }
      return edu;
    });
    updateEducation(updatedEducation);
  };

  const handleNext = () => {
    try {
      educationArraySchema.parse(tempEducation);
      setCurrentStep(3);
    } catch (error) {
      const fieldErrors: Record<string, string> = {};
      error.errors?.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-brand-blue-dark flex items-center space-x-2">
              <GraduationCap className="w-6 h-6" />
              <span>Education Information</span>
            </CardTitle>
            <Button
              onClick={addEducationEntry}
              className="bg-brand-blue-light hover:bg-brand-blue-dark"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {tempEducation.length === 0 && (
            <div className="text-center py-8">
              <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">
                No education entries added yet
              </p>
              <Button onClick={addEducationEntry} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Education Entry
              </Button>
            </div>
          )}

          <AnimatePresence>
            {tempEducation.map((education, index) => (
              <motion.div
                key={education.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-l-4 border-l-brand-blue-light">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-brand-blue-dark">
                        Education Entry {index + 1}
                      </h3>
                      {tempEducation.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEducationEntry(education.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Educational Level</Label>
                        <Select
                          value={education.educationalLevel}
                          onValueChange={(value) =>
                            updateEducationEntry(
                              education.id,
                              "educationalLevel",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {EDUCATION_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          value={education.institution}
                          onChange={(e) =>
                            updateEducationEntry(
                              education.id,
                              "institution",
                              e.target.value
                            )
                          }
                          placeholder="Institution name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Specialization</Label>
                        <Select
                          value={education.specialization}
                          onValueChange={(value) =>
                            updateEducationEntry(
                              education.id,
                              "specialization",
                              value
                            )
                          }
                          disabled={
                            !education.educationalLevel ||
                            SPECIALIZATIONS[
                              education.educationalLevel as keyof typeof SPECIALIZATIONS
                            ]?.length === 0
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            {education.educationalLevel &&
                              SPECIALIZATIONS[
                                education.educationalLevel as keyof typeof SPECIALIZATIONS
                              ]?.map((spec) => (
                                <SelectItem key={spec} value={spec}>
                                  {spec}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Board/University</Label>
                        <Input
                          value={education.boardOrUniversity}
                          onChange={(e) =>
                            updateEducationEntry(
                              education.id,
                              "boardOrUniversity",
                              e.target.value
                            )
                          }
                          placeholder="Board or University"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Percentage</Label>
                        <Input
                          value={education.percentage}
                          onChange={(e) =>
                            updateEducationEntry(
                              education.id,
                              "percentage",
                              e.target.value
                            )
                          }
                          placeholder="Percentage/CGPA"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Passed Out Year</Label>
                        <Input
                          type="number"
                          value={education.passedOutYear}
                          onChange={(e) =>
                            updateEducationEntry(
                              education.id,
                              "passedOutYear",
                              Number.parseInt(e.target.value)
                            )
                          }
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={education.location}
                          onChange={(e) =>
                            updateEducationEntry(
                              education.id,
                              "location",
                              e.target.value
                            )
                          }
                          placeholder="City, State"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Active Backlogs</Label>
                        <Input
                          type="number"
                          value={education.noOfActiveBacklogs}
                          onChange={(e) =>
                            updateEducationEntry(
                              education.id,
                              "noOfActiveBacklogs",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          min="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-red-800 font-medium mb-2">
                Please fix the following errors:
              </h4>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key}>• {message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-brand-blue-light hover:bg-brand-blue-dark"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
