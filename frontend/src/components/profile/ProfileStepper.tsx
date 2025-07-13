import { motion } from "framer-motion";
import { Check, User, GraduationCap, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  icon: React.ElementType;
  completed: boolean;
}

interface ProfileStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  isEditing: boolean;
}

const ProfileStepper = ({
  currentStep,
  onStepClick,
  isEditing,
}: ProfileStepperProps) => {
  const steps: Step[] = [
    {
      id: 0,
      title: "Personal Info",
      icon: User,
      completed: false, // You can add logic to determine completion
    },
    {
      id: 1,
      title: "Education",
      icon: GraduationCap,
      completed: false,
    },
    {
      id: 2,
      title: "Resume Upload",
      icon: FileText,
      completed: false,
    },
  ];

  return (
    <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
      {/* Progress Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 rounded-full">
        <motion.div
          className="h-full bg-blue-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Steps */}
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isClickable = !isEditing;
        // const isClickable = true;

        return (
          <motion.div
            key={step.id}
            className="relative z-10 "
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <motion.button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                " border-gray-400 border-2 flex items-center justify-center w-14 h-14 rounded-full border-3 transition-all  duration-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
                "shadow-soft hover:shadow-elegant",
                isActive && "bg-brand-blue-light  text-white  scale-110",
                isCompleted && "bg-blue-600 border-blue-600 text-white",
                !isActive &&
                  !isCompleted &&
                  " border-2 text-muted-foreground bg-white hover:border-primary/50",
                isClickable && "hover:scale-125 cursor-pointer",
                !isClickable && "cursor-default"
              )}
              whileHover={isClickable ? { scale: 1.25, y: -2 } : {}}
              whileTap={isClickable ? { scale: 1.05 } : {}}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                default: { duration: 0.3 },
              }}
            >
              {isEditing && isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </motion.button>

            <motion.p
              className={cn(
                "absolute top-14 mt-2  text-xs  font-medium whitespace-nowrap ",
                isActive && "text-primary",
                isCompleted && "text-blue-600",
                !isActive && !isCompleted && "text-muted-foreground"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 + 0.1 }}
            >
              {step.title}
            </motion.p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProfileStepper;
