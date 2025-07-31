import { AnimatePresence } from "framer-motion";
import { lazy, useEffect } from "react";
import { useProfileStore } from "@/store/profileStore";
const PersonalInfoStep = lazy(() => import("./PersonalInfoStep"));
const EducationStep = lazy(() => import("./EducationStep"));
const ResumeStep = lazy(() => import("./ResumeStep"));

export default function ProfileForm() {
  const { currentStep, hydrateProfile } = useProfileStore();
  useEffect(() => {
    hydrateProfile();
  }, [hydrateProfile]);

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
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-blue-dark mb-2">
            Create Your Profile
          </h1>
          <p className="text-gray-600">
            Complete all steps to create your comprehensive profile
          </p>
        </div>
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}
