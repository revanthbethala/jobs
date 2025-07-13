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
import { ProfileData } from "@/services/profileService";
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
    formState: { errors, isSubmitting },
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

  const removeEducation = (index: number) => {
    remove(index);
  };

  const onBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: EducationFormData) => {
    setTempEducation(data.education);
    setCurrentStep(currentStep + 1);
    console.log(currentStep);
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
                    {isEditing && fields.length > 0 && (
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
                  {/* Level and Institution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`education.${index}.level`}
                        className="flex items-center space-x-1"
                      >
                        <Award className="w-4 h-4" />
                        <span>Education Level *</span>
                      </Label>
                      {isEditing ? (
                        <Select
                          value={watch(`education.${index}.educationalLevel`)}
                          onValueChange={(value) =>
                            setValue(
                              `education.${index}.educationalLevel`,
                              value
                            )
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              errors.education?.[index]?.educationalLevel &&
                                "border-destructive focus:ring-destructive"
                            )}
                          >
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            {educationLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="px-3 py-2 rounded-md border bg-muted text-muted-foreground">
                          {field.educationalLevel || "Not provided"}
                        </div>
                      )}
                      {errors.education?.[index]?.educationalLevel && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.educationalLevel?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`education.${index}.institution`}
                        className="flex items-center space-x-1"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Institution *</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          {...register(`education.${index}.institution`)}
                          placeholder="Enter institution name"
                          className={cn(
                            errors.education?.[index]?.institution &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      ) : (
                        <div className="px-3 py-2 rounded-md border bg-muted text-muted-foreground">
                          {field.institution || "Not provided"}
                        </div>
                      )}
                      {errors.education?.[index]?.institution && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.institution?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Specialization and boardOrUniversity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`education.${index}.specialization`}>
                        Specialization
                        {specializationsByLevel[
                          watch(`education.${index}.educationalLevel`)
                        ]?.length > 0 && " *"}
                      </Label>
                      {isEditing ? (
                        <>
                          {specializationsByLevel[
                            watch(`education.${index}.educationalLevel`)
                          ]?.length > 0 ? (
                            <Select
                              value={watch(`education.${index}.specialization`)}
                              onValueChange={(value) =>
                                setValue(
                                  `education.${index}.specialization`,
                                  value
                                )
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
                            <div className="px-3 py-2 rounded-md border bg-muted/50 text-muted-foreground text-sm">
                              No specialization required for this level
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="px-3 py-2 rounded-md border bg-muted text-muted-foreground">
                          {field.specialization || "Not provided"}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`education.${index}.boardOrUniversity`}>
                        boardOrUniversity/University{" "}
                        <span className="text-red-600">*</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          {...register(`education.${index}.boardOrUniversity`)}
                          placeholder="Enter boardOrUniversity or university"
                          className={cn(
                            errors.education?.[index]?.boardOrUniversity &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      ) : (
                        <div className="px-3 py-2 rounded-md border bg-muted text-muted-foreground">
                          {field.boardOrUniversity || "Not provided"}
                        </div>
                      )}
                      {errors.education?.[index]?.boardOrUniversity && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.boardOrUniversity?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div className="space-y-2">
                      <Label htmlFor={`education.${index}.percentage`}>
                        Percentage <span className="text-red-600">*</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          {...register(`education.${index}.percentage`)}
                          placeholder="e.g., 85%"
                          type="number"
                          max="100"
                          className={cn(
                            errors.education?.[index]?.percentage &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      ) : (
                        <div className="px-3 py-2 rounded-md border bg-muted text-muted-foreground">
                          {field.percentage || "Not provided"}
                        </div>
                      )}
                      {errors.education?.[index]?.passedOutYear && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.percentage?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 pt-1 mt-1">
                      <Label
                        htmlFor={`education.${index}.passedOutYear`}
                        className="flex items-center space-x-1"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>
                          Passed Year <span className="text-red-600">*</span>
                        </span>
                      </Label>
                      {isEditing ? (
                        <Input
                          {...register(`education.${index}.passedOutYear`)}
                          placeholder="e.g., 2023"
                          type="number"
                          min="1950"
                          max={new Date().getFullYear() + 10}
                          className={cn(
                            errors.education?.[index]?.passedOutYear &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      ) : (
                        <div className="px-3 py-2 rounded-md border bg-muted text-muted-foreground">
                          {field.passedOutYear || "Not provided"}
                        </div>
                      )}
                      {errors.education?.[index]?.passedOutYear && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.passedOutYear?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location and Backlogs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`education.${index}.location`}
                        className="flex items-center space-x-1"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>
                          Location <span className="text-red-600">*</span>
                        </span>
                      </Label>
                      {isEditing ? (
                        <Input
                          {...register(`education.${index}.location`)}
                          placeholder="e.g., Mumbai, India"
                          className={cn(
                            errors.education?.[index]?.location &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      ) : (
                        <div className="px-3 py-2 rounded-md border bg-muted text-muted-foreground">
                          {field.location || "Not provided"}
                        </div>
                      )}
                      {errors.education?.[index]?.location && (
                        <p className="text-sm text-destructive">
                          {errors.education[index]?.location?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`education.${index}.noOfActiveBacklogs`}>
                        Active Backlogs
                      </Label>
                      {isEditing ? (
                        <Input
                          {...register(
                            `education.${index}.noOfActiveBacklogs`,
                            {
                              valueAsNumber: true,
                            }
                          )}
                          placeholder="0"
                          type="number"
                          min="0"
                        />
                      ) : (
                        <div className="px-3 py-2 rounded-md border bg-muted text-muted-foreground">
                          {field.noOfActiveBacklogs ?? "Not provided"}
                        </div>
                      )}
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
              No education information added yet
            </p>
            {isEditing && (
              <Button type="button" onClick={addEducation} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Education
              </Button>
            )}
          </motion.div>
        )}

        {isEditing && fields.length > 0 && (
          <motion.div
            className="flex justify-end pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isSubmitting ? "Saving..." : "Save Education"}
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
