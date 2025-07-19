import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { FormField } from './FormField';

interface TextInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  type?: 'text' | 'email' | 'tel' | 'url' | 'number';
  className?: string;
  required?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  error,
  registration,
  type = 'text',
  className,
  required = false,
}) => {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <Input
        type={type}
        placeholder={placeholder}
        {...registration}
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    </FormField>
  );
};