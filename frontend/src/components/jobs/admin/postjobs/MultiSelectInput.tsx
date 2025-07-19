import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "./FormField";

interface SelectOption {
  value: string;
  label: string;
}

interface MultiSelectInputProps {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  name: string;
  control: Control<any>;
  className?: string;
  required?: boolean;
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  label,
  options,
  placeholder = "Select options",
  error,
  name,
  control,
  className,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { field } = useController({ name, control, defaultValue: [] });

  const toggleOption = (value: string) => {
    const currentValues = field.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    field.onChange(newValues);
  };

  const handleSelectAll = () => {
    const currentValues = field.value || [];
    if (currentValues.length === options.length) {
      field.onChange([]);
    } else {
      field.onChange(options.map((option) => option.value));
    }
  };

  const isAllSelected = (field.value || []).length === options.length;

  const removeOption = (value: string) => {
    const newValues = (field.value || []).filter((v: string) => v !== value);
    field.onChange(newValues);
  };

  const selectedOptions = options.filter((option) =>
    (field.value || []).includes(option.value)
  );

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      className={className}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "w-full justify-between min-h-[48px] h-auto px-3 py-2",
              error && "border-destructive"
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1 text-left">
              {selectedOptions.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(option.value);
                      }}
                      className="ml-1 hover:bg-secondary/80 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-2 border-b border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-8 text-xs w-full justify-start"
            >
              <Checkbox
                checked={isAllSelected}
                className="mr-2 pointer-events-none"
              />
              {isAllSelected ? "Deselect All" : "Select All"}
            </Button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer"
                onClick={() => toggleOption(option.value)}
              >
                <Checkbox
                  checked={(field.value || []).includes(option.value)}
                  className="pointer-events-none"
                />
                <span className="text-sm flex-1">{option.label}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </FormField>
  );
};
