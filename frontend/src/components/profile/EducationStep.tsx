import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useProfileStore } from "@/store/profileStore";
import { EDUCATION_LEVELS, SPECIALIZATIONS } from "@/lib/constants";
import { educationArraySchema } from "@/schemas/profileSchema";
import { z } from "zod";

const schema = z.object({
  education: educationArraySchema,
});

type FormValues = z.infer<typeof schema>;

export default function EducationStep() {
  const { tempEducation, updateEducation, setCurrentStep } = useProfileStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      education: tempEducation.length
        ? tempEducation
        : [
            {
              id: Date.now().toString(),
              educationalLevel: "",
              institution: "",
              specialization: "",
              boardOrUniversity: "",
              percentage: 0,
              passedOutYear: Number(new Date().getFullYear()),
              location: "",
              noOfActiveBacklogs: 0,
            },
          ],
    },
  });

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const onSubmit = (data: FormValues) => {
    updateEducation(data.education);
    setCurrentStep(3);
  };

  const handleBack = () => setCurrentStep(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-6xl mx-auto">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-2 text-brand-blue-dark">
                <GraduationCap className="w-6 h-6" />
                <span>Education Information</span>
              </CardTitle>
              <Button
                type="button"
                onClick={() =>
                  append({
                    id: Date.now().toString(),
                    educationalLevel: "",
                    institution: "",
                    specialization: "",
                    boardOrUniversity: "",
                    percentage: 0,
                    passedOutYear: new Date().getFullYear(),
                    location: "",
                    noOfActiveBacklogs: 0,
                  })
                }
                className="bg-brand-blue-light hover:bg-brand-blue-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-4 sm:px-6 lg:px-8 pb-8">
            {fields.map((field, index) => {
              const level = watch(`education.${index}.educationalLevel`);
              const specs =
                SPECIALIZATIONS[level as keyof typeof SPECIALIZATIONS] || [];

              return (
                <Card
                  key={field.id}
                  className="border-l-4 border-l-brand-blue-light bg-white"
                >
                  <CardHeader className="pb-2 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-brand-blue-dark">
                      Education Entry {index + 1}
                    </h3>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Educational Level */}
                    <div className="space-y-2 w-full">
                      <Label>Educational Level</Label>
                      <Select
                        value={level}
                        onValueChange={(value) =>
                          form.setValue(
                            `education.${index}.educationalLevel`,
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {EDUCATION_LEVELS.map((lvl) => (
                            <SelectItem key={lvl} value={lvl}>
                              {lvl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.education?.[index]?.educationalLevel && (
                        <p className="text-red-600 text-sm">
                          {errors.education[index].educationalLevel?.message}
                        </p>
                      )}
                    </div>

                    {/* Institution */}
                    <div className="space-y-2 w-full">
                      <Label>Institution</Label>
                      <Input
                        {...register(`education.${index}.institution`)}
                        placeholder="Institution name"
                      />
                      {errors.education?.[index]?.institution && (
                        <p className="text-red-600 text-sm">
                          {errors.education[index].institution?.message}
                        </p>
                      )}
                    </div>

                    {/* Specialization */}
                    <div className="space-y-2 w-full">
                      <Label>Specialization</Label>
                      <Select
                        disabled={!level || specs.length === 0}
                        value={watch(`education.${index}.specialization`)}
                        onValueChange={(value) =>
                          form.setValue(
                            `education.${index}.specialization`,
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          {specs.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.education?.[index]?.specialization && (
                        <p className="text-red-600 text-sm">
                          {errors.education[index].specialization?.message}
                        </p>
                      )}
                    </div>

                    {/* Board/University */}
                    <div className="space-y-2 w-full">
                      <Label>Board/University</Label>
                      <Input
                        {...register(`education.${index}.boardOrUniversity`)}
                      />
                      {errors.education?.[index]?.boardOrUniversity && (
                        <p className="text-red-600 text-sm">
                          {errors.education[index].boardOrUniversity?.message}
                        </p>
                      )}
                    </div>

                    {/* Percentage */}
                    <div className="space-y-2 w-full">
                      <Label>Percentage</Label>
                      <Input
                        type="number"
                        {...register(`education.${index}.percentage`, {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.education?.[index]?.percentage && (
                        <p className="text-red-600 text-sm">
                          {errors.education[index].percentage?.message}
                        </p>
                      )}
                    </div>

                    {/* Passed Out Year */}
                    <div className="space-y-2 w-full">
                      <Label>Passed Out Year</Label>
                      <Input
                        type="number"
                        {...register(`education.${index}.passedOutYear`, {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.education?.[index]?.passedOutYear && (
                        <p className="text-red-600 text-sm">
                          {errors.education[index].passedOutYear?.message}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="space-y-2 w-full">
                      <Label>Location</Label>
                      <Input {...register(`education.${index}.location`)} />
                      {errors.education?.[index]?.location && (
                        <p className="text-red-600 text-sm">
                          {errors.education[index].location?.message}
                        </p>
                      )}
                    </div>

                    {/* No. of Active Backlogs */}
                    <div className="space-y-2 w-full">
                      <Label>Active Backlogs</Label>
                      <Input
                        type="number"
                        {...register(
                          `education.${index}.noOfActiveBacklogs`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                      />
                      {errors.education?.[index]?.noOfActiveBacklogs && (
                        <p className="text-red-600 text-sm">
                          {
                            errors.education[index].noOfActiveBacklogs
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                type="submit"
                className="bg-brand-blue-light hover:bg-brand-blue-dark"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  );
}
