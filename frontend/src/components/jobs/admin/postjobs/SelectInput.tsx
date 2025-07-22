import React from "react";
import { UseFormRegisterReturn, useController } from "react-hook-form";
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
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  className?: string;
  required?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  placeholder = "Select an option",
  error,
  registration,
  className,
  required = false,
}) => {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <Select
        onValueChange={(value) => registration.onChange({ target: { value, name: registration.name } })}
        defaultValue={registration.value}
      >
        <SelectTrigger
          className={cn(
            "w-full",
            error && "border-destructive focus:ring-destructive"
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
