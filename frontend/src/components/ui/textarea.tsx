import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
                className={cn(
                  "flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-base md:text-sm",
                  "placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-brand-blue-light focus:border-brand-blue-light",
                  "disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]",
                  className
                )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
