import React, { useState, KeyboardEvent } from "react";
import { Control, useController } from "react-hook-form";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TagsInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  name: string;
  control: Control<any>;
  className?: string;
  required?: boolean;
}

export const TagsInput: React.FC<TagsInputProps> = ({
  label,
  placeholder = "Add tags and press Enter",
  error,
  name,
  control,
  className,
  required = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const { field } = useController({ name, control, defaultValue: [] });

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !(field.value || []).includes(trimmedValue)) {
      field.onChange([...(field.value || []), trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    field.onChange(
      (field.value || []).filter((tag: string) => tag !== tagToRemove)
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      (field.value || []).length > 0
    ) {
      removeTag((field.value || [])[(field.value || []).length - 1]);
    }
  };

  return (
    <div className={cn("space-y-2 animate-fade-in-up", className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      <div
        className={cn(
          "w-full px-4 py-3 rounded-lg border border-input bg-background",
          "focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent",
          "transition-all duration-200 ease-in-out min-h-[48px]",
          error && "border-destructive focus-within:ring-destructive"
        )}
      >
        <div className="flex flex-wrap gap-2 mb-2">
          {(field.value || []).map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
            >
              {tag}
              <X
                className="w-3 h-3 cursor-pointer hover:bg-primary/80 rounded"
                onClick={() => removeTag(tag)}
              />
            </span>
          ))}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive animate-slide-in-right">
          {error}
        </p>
      )}
    </div>
  );
};
