import React from "react";
import { Control, useController } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormField } from "./FormField";

interface DateInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  name: string;
  control: Control<any>;
  className?: string;
  required?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  placeholder = "Pick a date",
  error,
  name,
  control,
  className,
  required = false,
}) => {
  const { field } = useController({ name, control });

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      className={className}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10 px-3",
              !field.value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date < new Date()}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </FormField>
  );
};
