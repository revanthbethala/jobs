import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  className?: string;
  required?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  placeholder = 'Select an option',
  error,
  registration,
  className,
  required = false,
}) => {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <div className="relative">
        <select
          {...registration}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer',
            error && 'border-destructive focus:ring-destructive'
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    </FormField>
  );
};