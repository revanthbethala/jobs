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
  minDate = new Date(new Date().setDate(new Date().getDate() - 1)),
}) => {
  const { field } = useController({ name, control });
  const [tempDate, setTempDate] = useState<Date | undefined>(field.value);
  const now = new Date();
  const [hour, setHour] = useState<number>(
    field.value?.getHours() || now.getHours()
  );
  const [minute, setMinute] = useState<number>(
    Math.ceil((field.value?.getMinutes() || now.getMinutes()) / 15) * 15
  );
  const [isOpen, setIsOpen] = useState(false);

  const isToday =
    tempDate && format(tempDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setTempDate(date);

    if (!includeTime) {
      field.onChange(date);
      setIsOpen(false);
    } else {
      // Update display values when date changes
      const isSelectedToday =
        format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
      if (isSelectedToday) {
        const currentHour = now.getHours();
        const currentMinute = Math.ceil(now.getMinutes() / 15) * 15;
        setDisplayHour(
          currentHour === 0
            ? "12"
            : currentHour > 12
            ? (currentHour - 12).toString()
            : currentHour.toString()
        );
        setDisplayMinute(
          currentMinute === 60
            ? "00"
            : currentMinute.toString().padStart(2, "0")
        );
        setIsPM(currentHour >= 12);
      }
    }
  };

  const [isPM, setIsPM] = useState<boolean>(
    field.value ? field.value.getHours() >= 12 : now.getHours() >= 12
  );
  const [displayHour, setDisplayHour] = useState<string>(
    field.value
      ? field.value.getHours() === 0
        ? "12"
        : field.value.getHours() > 12
        ? (field.value.getHours() - 12).toString()
        : field.value.getHours().toString()
      : now.getHours() === 0
      ? "12"
      : now.getHours() > 12
      ? (now.getHours() - 12).toString()
      : now.getHours().toString()
  );
  const [displayMinute, setDisplayMinute] = useState<string>(
    field.value
      ? field.value.getMinutes().toString().padStart(2, "0")
      : Math.ceil(now.getMinutes() / 15) * 15 === 60
      ? "00"
      : (Math.ceil(now.getMinutes() / 15) * 15).toString().padStart(2, "0")
  );

  const handleTimeApply = () => {
    if (!tempDate) return;

    const hourNum = parseInt(displayHour) || 1;
    const minuteNum = parseInt(displayMinute) || 0;

    // Convert to 24-hour format
    let finalHour = hourNum;
    if (isPM && hourNum !== 12) {
      finalHour = hourNum + 12;
    } else if (!isPM && hourNum === 12) {
      finalHour = 0;
    }

    // Validate time bounds
    if (hourNum < 1 || hourNum > 12 || minuteNum < 0 || minuteNum > 59) {
      return;
    }

    // Check if the time is in the past for today
    if (isToday) {
      const selectedTime = setMinutes(setHours(tempDate, finalHour), minuteNum);
      if (selectedTime <= now) {
        return;
      }
    }

    const finalDate = setMinutes(setHours(tempDate, finalHour), minuteNum);
    field.onChange(finalDate);
    setIsOpen(false);
  };

  const handleHourChange = (value: string) => {
    // Allow empty string or numbers 1-12
    if (
      value === "" ||
      (/^\d{1,2}$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 12)
    ) {
      setDisplayHour(value);
    }
  };

  const handleMinuteChange = (value: string) => {
    // Allow empty string or numbers 0-59
    if (
      value === "" ||
      (/^\d{0,2}$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 59)
    ) {
      setDisplayMinute(value);
    }
  };

  const formatDisplayValue = (value: Date) => {
    if (includeTime) {
      return format(value, "PPP 'at' p");
    }
    return format(value, "PPP");
  };

  const generateTimeSlots = () => {
    // This function is no longer needed but keeping for potential future use
    return [];
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const timeSlots = generateTimeSlots();

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
                disabled={(date) => date <= minDate}
                initialFocus
                className="rounded-md"
              />
            </div>

            {/* Time Selection Section */}
            {includeTime && tempDate && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Select Time</span>
                </div>

                {/* Time Input Fields */}
                <div className="flex items-center justify-center gap-3">
                  {/* Hour Input */}
                  <div className="flex flex-col items-center gap-1">
                    <label className="text-xs text-muted-foreground">
                      Hour
                    </label>
                    <input
                      type="text"
                      value={displayHour}
                      onChange={(e) => handleHourChange(e.target.value)}
                      className={cn(
                        "w-12 h-10 text-center text-sm border border-input rounded-md",
                        "bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                        "focus:border-transparent"
                      )}
                      placeholder="12"
                      maxLength={2}
                    />
                  </div>

                  <div className="text-xl font-medium text-muted-foreground mt-6">
                    :
                  </div>

                  {/* Minute Input */}
                  <div className="flex flex-col items-center gap-1">
                    <label className="text-xs text-muted-foreground">
                      Minute
                    </label>
                    <input
                      type="text"
                      value={displayMinute}
                      onChange={(e) => handleMinuteChange(e.target.value)}
                      className={cn(
                        "w-12 h-10 text-center text-sm border border-input rounded-md",
                        "bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                        "focus:border-transparent"
                      )}
                      placeholder="00"
                      maxLength={2}
                    />
                  </div>

                  {/* AM/PM Toggle */}
                  <div className="flex flex-col items-center gap-1">
                    <label className="text-xs text-muted-foreground">
                      Period
                    </label>
                    <div className="flex border border-input rounded-md overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setIsPM(false)}
                        className={cn(
                          "px-3 py-2 text-sm font-medium transition-colors",
                          !isPM
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted"
                        )}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPM(true)}
                        className={cn(
                          "px-3 py-2 text-sm font-medium transition-colors",
                          isPM
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted"
                        )}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Time Buttons */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Quick select:
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {[
                      { label: "9:00 AM", hour: "9", minute: "00", pm: false },
                      { label: "12:00 PM", hour: "12", minute: "00", pm: true },
                      { label: "1:00 PM", hour: "1", minute: "00", pm: true },
                      { label: "5:00 PM", hour: "5", minute: "00", pm: true },
                    ].map(({ label, hour: h, minute: m, pm }) => {
                      // Convert to 24-hour for validation
                      let checkHour = parseInt(h);
                      if (pm && checkHour !== 12) checkHour += 12;
                      else if (!pm && checkHour === 12) checkHour = 0;

                      // Skip if time is in the past for today
                      if (
                        isToday &&
                        (checkHour < now.getHours() ||
                          (checkHour === now.getHours() &&
                            parseInt(m) <= now.getMinutes()))
                      ) {
                        return null;
                      }

                      return (
                        <Button
                          key={label}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-3 text-xs"
                          onClick={() => {
                            setDisplayHour(h);
                            setDisplayMinute(m);
                            setIsPM(pm);
                          }}
                        >
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Apply/Cancel Buttons */}
                <div className="flex gap-2 pt-2 border-t">
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
                    disabled={!tempDate || !displayHour || displayMinute === ""}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}

            {/* Cancel button for date-only mode */}
            {!includeTime && (
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </FormField>
  );
};
