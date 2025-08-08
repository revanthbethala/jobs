import React from "react";
import { Control, useController } from "react-hook-form";
import { FormField } from "./FormField";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  name: string;
  control: Control<any>;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  control,
  options,
  placeholder = "Select an option",
  error,
  className,
  required = false,
}) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    defaultValue: "", // You can override this via form's defaultValues
  });

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      className={className}
    >
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-destructive ring-destructive focus:ring-destructive"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
};
