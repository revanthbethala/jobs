import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Save, X, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import PersonalInfoSection from "@/components/profile/PersonalInfoSection";
import EducationSection from "@/components/profile/EducationSection";
import ResumeUploadSection from "@/components/profile/ResumeUploadSection";
import ProfileStepper from "@/components/profile/ProfileStepper";
import { useProfileStore } from "@/store/profileStore";
import { useAuthStore } from "@/store/authStore";

interface ProfileProps {
  forceEditing?: boolean;
  showEditButton?: boolean;
}

const Profile: React.FC<ProfileProps> = ({
  forceEditing = false,
  showEditButton = true,
}) => {
  const {
    profile,
    isLoading,
    isEditing,
    currentStep,
    profilePictureAnimationComplete,
    fetchProfile,
    setEditing,
    setCurrentStep,
  } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    // Ensure edit mode is true when forced
    if (forceEditing) {
      setEditing(true);
    }
  }, [forceEditing, setEditing]);

  const isEditMode = forceEditing || isEditing;

  const handleEditToggle = () => {
    if (!forceEditing) {
      setEditing(!isEditing);
      if (isEditing) setCurrentStep(0);
    }
  };

  const renderCurrentSection = () => {
    if (!profile) return null;
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoSection
            profile={profile}
            isEditing={isEditMode}
            // showAnimation={showInitialAnimation}
          />
        );
      case 1:
        return <EducationSection profile={profile} isEditing={isEditMode} />;
      case 2:
        return <ResumeUploadSection />;
      default:
        return null;
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 size={30} className="animate-spin text-blue-600 " />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Profile Not Found
          </h2>
          <p className="text-muted-foreground">
            Unable to load profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto px-4 md:px-4 py-4">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            </div>
            {showEditButton && (
              <Button
                onClick={handleEditToggle}
                variant={isEditMode ? "outline" : "default"}
                className={cn(
                  "transition-all duration-300 w-full sm:w-auto",
                  !isEditMode && "bg-blue-700 hover:bg-brand-blue-light"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isEditMode ? (
                  <X className="w-4 h-4 mr-2" />
                ) : (
                  <Edit className="w-4 h-4 mr-2" />
                )}
                {isLoading
                  ? "Loading..."
                  : isEditMode
                  ? "Cancel"
                  : "Edit Profile"}
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-6 sm:py-10">
        {/* Stepper */}
        <AnimatePresence>
          {profilePictureAnimationComplete && (
            <ProfileStepper
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              isEditing={isEditing}
            />
          )}
        </AnimatePresence>

        {/* Section */}
        <motion.div
          className="bg-card rounded-lg shadow-elegant border p-4 sm:p-10 md:p-8 mt-6"
          layout
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentSection()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
