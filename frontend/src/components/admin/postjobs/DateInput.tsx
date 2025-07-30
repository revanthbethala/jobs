import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
import { format, setHours, setMinutes } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
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
  control: Control;
  className?: string;
  required?: boolean;
  includeTime?: boolean;
  minDate?: Date;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  placeholder = "Pick a date and time",
  error,
  name,
  control,
  className,
  required = false,
  includeTime = true,
  minDate = new Date(),
}) => {
  const { field } = useController({ name, control });
  const [tempDate, setTempDate] = useState<Date | undefined>(field.value);
  const [hour, setHour] = useState<number>(
    field.value?.getHours() || new Date().getHours()
  );
  const [minute, setMinute] = useState<number>(
    Math.ceil((field.value?.getMinutes() || new Date().getMinutes()) / 15) * 15
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setTempDate(date);

    if (!includeTime) {
      field.onChange(date);
      setIsOpen(false);
    }
  };

  const handleTimeApply = () => {
    if (!tempDate) return;

    const finalDate = setMinutes(setHours(tempDate, hour), minute);
    field.onChange(finalDate);
    setIsOpen(false);
  };

  const handleTimeChange = (newHour: number, newMinute: number) => {
    setHour(newHour);
    setMinute(newMinute);

    if (tempDate) {
      const finalDate = setMinutes(setHours(tempDate, newHour), newMinute);
      setTempDate(finalDate);
    }
  };

  const formatDisplayValue = (value: Date) => {
    if (includeTime) {
      return format(value, "PPP 'at' p");
    }
    return format(value, "PPP");
  };

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
            className={cn(
              "w-full justify-start text-left font-normal h-11 px-3 py-2",
              "border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              !field.value && "text-muted-foreground",
              error && "border-destructive focus:ring-destructive"
            )}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">
              {field.value ? formatDisplayValue(field.value) : placeholder}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 shadow-lg border"
          align="start"
          sideOffset={4}
        >
          <div className="p-4 space-y-4">
            {/* Calendar Section */}
            <div className="border-b pb-4">
              <Calendar
                mode="single"
                selected={tempDate || field.value}
                onSelect={handleDateSelect}
                disabled={(date) => date < minDate}
                initialFocus
                className="rounded-md"
              />
            </div>

            {/* Time Selection Section */}
            {includeTime && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Select Time</span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {/* Hour Selector */}
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-muted-foreground mb-1">
                      Hour
                    </label>
                    <select
                      className={cn(
                        "w-16 h-9 px-2 text-sm border border-input rounded-md",
                        "bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                        "focus:border-transparent"
                      )}
                      value={hour}
                      onChange={(e) =>
                        handleTimeChange(Number(e.target.value), minute)
                      }
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xl font-medium text-muted-foreground mt-6">
                    :
                  </div>

                  {/* Minute Selector */}
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-muted-foreground mb-1">
                      Minute
                    </label>
                    <select
                      className={cn(
                        "w-16 h-9 px-2 text-sm border border-input rounded-md",
                        "bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                        "focus:border-transparent"
                      )}
                      value={minute}
                      onChange={(e) =>
                        handleTimeChange(hour, Number(e.target.value))
                      }
                    >
                      {[0, 15, 30, 45].map((m) => (
                        <option key={m} value={m}>
                          {m.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preview and Apply */}
                <div className="pt-2 border-t">
                  <div className="text-center mb-3">
                    <span className="text-xs text-muted-foreground">
                      Preview:{" "}
                    </span>
                    <span className="text-sm font-medium">
                      {tempDate &&
                        formatDisplayValue(
                          setMinutes(setHours(tempDate, hour), minute)
                        )}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={handleTimeApply}
                      disabled={!tempDate}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </FormField>
  );
};
