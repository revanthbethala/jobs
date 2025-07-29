import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface TextAreaProps {
  label: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  rows?: number;
  className?: string;
  required?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  error,
  registration,
  rows = 4,
  className,
  required = false,
}) => {
  return (
    <div className={cn('space-y-2 animate-fade-in-up', className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        {...registration}
        className={cn(
          'w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-all duration-200 ease-in-out resize-vertical',
          'placeholder:text-muted-foreground',
          error && 'border-destructive focus:ring-destructive'
        )}
      />
      {error && (
        <p className="text-sm text-destructive animate-slide-in-right">{error}</p>
      )}
    </div>
  );
};