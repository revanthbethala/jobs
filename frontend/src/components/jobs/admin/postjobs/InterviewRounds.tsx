import React from "react";
import { Control, FieldErrors, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { JobFormData } from "@/schemas/jobsSchema";
import { TextInput } from "./TextInput";
import { TextArea } from "./TextArea";
import { useJobStore } from "@/store/jobStore";

interface InterviewRoundsSectionProps {
  control: Control<JobFormData>;
  errors: FieldErrors<JobFormData>;
}

const InterviewRounds = ({control, errors}) => {
  const { addInterviewRound, removeInterviewRound } = useJobStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "interviewRounds",
  });

  const handleAddRound = () => {
    const newRound = {
      id: Date.now().toString(),
      roundNumber: fields.length + 1,
      roundName: "",
      description: "",
    };
    append(newRound);
    addInterviewRound();
  };

  const handleRemoveRound = (index: number) => {
    const roundToRemove = fields[index];
    remove(index);
    removeInterviewRound(roundToRemove.id);
  };

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Interview Rounds
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRound}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Round
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              No interview rounds added yet
            </p>
            <p className="text-sm">Click "Add Round" to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card
                key={field.id}
                className="border-2 border-muted animate-slide-in-right"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-foreground">
                      Round {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveRound(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="hidden"
                    {...control.register(`interviewRounds.${index}.id`)}
                  />
                  <input
                    type="hidden"
                    {...control.register(
                      `interviewRounds.${index}.roundNumber`
                    )}
                    value={index + 1}
                  />

                  <TextInput
                    label="Round Name"
                    placeholder="e.g., Technical Interview, HR Round"
                    registration={control.register(
                      `interviewRounds.${index}.roundName`
                    )}
                    error={errors.interviewRounds?.[index]?.roundName?.message}
                    required
                  />

                  <TextArea
                    label="Description"
                    placeholder="Describe what this round will cover..."
                    registration={control.register(
                      `interviewRounds.${index}.description`
                    )}
                    error={
                      errors.interviewRounds?.[index]?.description?.message
                    }
                    rows={3}
                    required
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {errors.interviewRounds?.root && (
          <p className="text-sm text-destructive animate-slide-in-right">
            {errors.interviewRounds.root.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
export default InterviewRounds;
