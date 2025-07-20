import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Personal Information" },
    { number: 2, title: "Education" },
    { number: 3, title: "Resume Upload" },
  ]

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  currentStep > step.number
                    ? "bg-brand-blue-light text-white"
                    : currentStep === step.number
                      ? "bg-brand-blue-light text-white ring-4 ring-brand-blue-light/20"
                      : "bg-gray-200 text-gray-600",
                )}
              >
                {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-20",
                  currentStep >= step.number ? "text-brand-blue-light" : "text-gray-500",
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-all duration-200",
                  currentStep > step.number ? "bg-brand-blue-light" : "bg-gray-200",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
