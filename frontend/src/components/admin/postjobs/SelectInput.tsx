// // import React from "react";
// // import { UseFormRegisterReturn } from "react-hook-form";
// // import { FormField } from "./FormField";
// // import { cn } from "@/lib/utils";
// // import {
// //   Select,
// //   SelectTrigger,
// //   SelectValue,
// //   SelectContent,
// //   SelectItem,
// // } from "@/components/ui/select";

// // interface SelectOption {
// //   value: string;
// //   label: string;
// // }

// // interface SelectInputProps {
// //   label: string;
// //   options: ReadonlyArray<SelectOption>;
// //   placeholder?: string;
// //   error?: string;
// //   registration: UseFormRegisterReturn;
// //   className?: string;
// //   required?: boolean;
// // }

// // export const SelectInput: React.FC<SelectInputProps> = ({
// //   label,
// //   options,
// //   placeholder = "Select an option",
// //   error,
// //   registration,
// //   className,
// //   required = false,
// // }) => {
// //   return (
// //     <FormField label={label} required={required} error={error} className={className}>
// //       <Select
// //         onValueChange={(value) => registration.onChange({ target: { value, name: registration.name } })}
// //         defaultValue={registration.value}
// //       >
// //         <SelectTrigger
// //           className={cn(
// //             "w-full",
// //             error && "border-destructive focus:ring-destructive"
// //           )}
// //         >
// //           <SelectValue placeholder={placeholder} />
// //         </SelectTrigger>
// //         <SelectContent>
// //           {options.map((option) => (
// //             <SelectItem key={option.value} value={option.value}>
// //               {option.label}
// //             </SelectItem>
// //           ))}
// //         </SelectContent>
// //       </Select>
// //     </FormField>
// //   );
// // };
// import React from "react";
// import { UseFormRegisterReturn } from "react-hook-form";
// import { FormField } from "./FormField";
// import { cn } from "@/lib/utils";

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface SelectInputProps {
//   label: string;
//   options: ReadonlyArray<SelectOption>;
//   placeholder?: string;
//   error?: string;
//   registration: UseFormRegisterReturn;
//   className?: string;
//   required?: boolean;
// }

// export const SelectInput: React.FC<SelectInputProps> = ({
//   label,
//   options,
//   placeholder = "Select an option",
//   error,
//   registration,
//   className,
//   required = false,
// }) => {
//   return (
//     <FormField label={label} required={required} error={error} className={className}>
//       <div className="relative">
//         <select
//           {...registration}
//           // defaultValue={registration?.value || ""}
//           className={cn(
//             "peer w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//             error && "border-destructive ring-destructive focus:ring-destructive",
//           )}
//         >
//           <option value="" disabled>
//             {placeholder}
//           </option>
//           {options.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>

//         {/* Custom arrow icon */}
//         <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
//           ▼
//         </div>
//       </div>
//     </FormField>
//   );
// };

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
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
  value?: string;
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
  value?; // 🔹 Add this
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  placeholder = "Select an option",
  error,
  registration,
  className,
  required = false,
  value, // 🔹 Receive current value from parent form
}) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      className={className}
    >
      <Select
        value={value}
        onValueChange={(value) =>
          registration.onChange({
            target: { name: registration.name, value },
          })
        }
      >
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
