"use client";

import { StepIndicator } from "./step-indicator";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { EducationStep } from "./EducationStep";
import { ResumeStep } from "./ResumeStep";
import { AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/store/profileStore";

export default function ProfileForm() {
  const { currentStep } = useProfileStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <EducationStep />;
      case 3:
        return <ResumeStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-blue-dark mb-2">
            Create Your Profile
          </h1>
          <p className="text-gray-600">
            Complete all steps to create your comprehensive profile
          </p>
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={3} />

        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}
