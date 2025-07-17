"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  GraduationCap,
  MapPin,
  Award,
  Calendar,
} from "lucide-react";
import { z } from "zod";
import { useProfileStore } from "@/store/profileStore";
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
import { cn } from "@/lib/utils";
import { educationSchema } from "@/schemas/profileSchema";
import { ProfileData } from "@/types/profileTypes";

interface EducationSectionProps {
  profile: ProfileData;
  isEditing: boolean;
}

const educationFormSchema = z.object({
  education: z
    .array(educationSchema)
    .min(1, "At least one education record is required"),
});

type EducationFormData = z.infer<typeof educationFormSchema>;

const educationLevels = [
  "10th",
  "12th",
  "Diploma",
  "B.Tech",
  "M.Tech",
  "MBA",
  "Pharmacy",
  "Pharm D",
];

const specializationsByLevel: Record<string, string[]> = {
  "10th": [],
  "12th": ["MPC", "BIPC", "MEC", "HEC", "CEC"],
  Diploma: [
    "CSE",
    "CSE-DATA SCIENCE",
    "AIML",
    "CSE-AIML",
    "IT",
    "MECH",
    "EEE",
    "ECE",
    "CSE-R",
  ],
  "B.Tech": [
    "CSE",
    "CSE-DATA SCIENCE",
    "AIML",
    "CSE-AIML",
    "IT",
    "MECH",
    "EEE",
    "ECE",
    "CSE-R",
  ],
  "M.Tech": [
    "CSE",
    "CSE-DATA SCIENCE",
    "AIML",
    "CSE-AIML",
    "IT",
    "MECH",
    "EEE",
    "ECE",
    "CSE-R",
  ],
  MBA: [
    "CSE",
    "CSE-DATA SCIENCE",
    "AIML",
    "CSE-AIML",
    "IT",
    "MECH",
    "EEE",
    "ECE",
    "MBA",
    "CSE-R",
  ],
  Pharmacy: [],
  "Pharm D": [],
};

const EducationSection = ({ profile, isEditing }: EducationSectionProps) => {
  const { setTempEducation, currentStep, setCurrentStep, tempEducation } =
    useProfileStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      education: tempEducation || profile.education || [],
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const addEducation = () => {
    append({
      educationalLevel: "",
      institution: "",
      specialization: "",
      boardOrUniversity: "",
      percentage: 0,
      passedOutYear: 0,
      location: "",
      noOfActiveBacklogs: 0,
    });
  };

  const removeEducation = (index: number) => remove(index);

  const onBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSubmit = (data: EducationFormData) => {
    setTempEducation(data.education);
    setCurrentStep(currentStep + 1);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-foreground">Education</h2>
        </div>

        {isEditing && (
          <Button
            type="button"
            onClick={addEducation}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </Button>
        )}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="popLayout">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="shadow-soft hover:shadow-elegant transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Education {index + 1}
                    </CardTitle>
                    {isEditing && (
                      <Button
                        type="button"
                        onClick={() => removeEducation(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>Education Level</span>
                        <span className="text-red-600">*</span>
                      </Label>
                      <Select
                        disabled={!isEditing}
                        value={watch(`education.${index}.educationalLevel`)}
                        onValueChange={(value) =>
                          setValue(`education.${index}.educationalLevel`, value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            errors.education?.[index]?.educationalLevel &&
                              "border-destructive focus:ring-destructive"
                          )}
                        >
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.education?.[index]?.educationalLevel && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.educationalLevel?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center space-x-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>Institution *</span>
                      </Label>
                      <Input
                        {...register(`education.${index}.institution`)}
                        placeholder="Enter institution"
                        disabled={!isEditing}
                        className={cn(
                          errors.education?.[index]?.institution &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.education?.[index]?.institution && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.institution?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Specialization</Label>
                      {specializationsByLevel[
                        watch(`education.${index}.educationalLevel`)
                      ]?.length ? (
                        <Select
                          disabled={!isEditing}
                          value={
                            watch(`education.${index}.specialization`) || ""
                          }
                          onValueChange={(value) =>
                            setValue(`education.${index}.specialization`, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            {specializationsByLevel[
                              watch(`education.${index}.educationalLevel`)
                            ].map((spec) => (
                              <SelectItem key={spec} value={spec}>
                                {spec}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Not required
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Board / University *</Label>
                      <Input
                        {...register(`education.${index}.boardOrUniversity`)}
                        placeholder="JNTUH"
                        disabled={!isEditing}
                        className={cn(
                          errors.education?.[index]?.boardOrUniversity &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.education?.[index]?.boardOrUniversity && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.boardOrUniversity?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Percentage *</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 85"
                        disabled={!isEditing}
                        {...register(`education.${index}.percentage`, {
                          valueAsNumber: true,
                        })}
                        className={cn(
                          errors.education?.[index]?.percentage &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.education?.[index]?.percentage && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.percentage?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Passed Out Year *</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 2023"
                        disabled={!isEditing}
                        {...register(`education.${index}.passedOutYear`, {
                          valueAsNumber: true,
                        })}
                        className={cn(
                          errors.education?.[index]?.passedOutYear &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.education?.[index]?.passedOutYear && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.passedOutYear?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Input
                        disabled={!isEditing}
                        {...register(`education.${index}.location`)}
                        placeholder="e.g., Hyderabad"
                        className={cn(
                          errors.education?.[index]?.location &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.education?.[index]?.location && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.location?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Active Backlogs</Label>
                      <Input
                        type="number"
                        disabled={!isEditing}
                        min={0}
                        {...register(`education.${index}.noOfActiveBacklogs`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {fields.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No education information added yet.
            </p>
            <Button type="button" onClick={addEducation} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Education
            </Button>
          </motion.div>
        )}

        {isEditing && (
          <motion.div
            className="flex justify-between pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button type="button" onClick={onBack} variant="outline">
              ← Back
            </Button>
            <Button
              type="submit"
              className="bg-brand-blue-light hover:bg-brand-blue-light/90"
            >
              Next →
            </Button>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default EducationSection;
