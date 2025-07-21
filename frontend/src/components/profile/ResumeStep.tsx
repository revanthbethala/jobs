import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useProfileStore } from "@/store/profileStore";
import { resumeSchema } from "@/schemas/profileSchema";
import { updateProfile } from "@/services/profileService";

export function ResumeStep() {
  const {
    tempResume,
    setResume,
    setCurrentStep,
    tempPersonalInfo,
    tempEducation,
    resetForm,
  } = useProfileStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        resumeSchema.parse({ resume: file });
        setResume(file);
        setErrors({});
      } catch (error) {
        const fieldErrors: Record<string, string> = {};
        error.errors?.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleSubmit = async () => {
    // console.log("=== FILE DEBUG START ===");
    // console.log("tempPersonalInfo.profilePic:", tempPersonalInfo.profilePic);
    // console.log(
    //   "tempPersonalInfo.profilePic instanceof File:",
    //   tempPersonalInfo.profilePic instanceof File
    // );
    // console.log("tempResume:", tempResume);
    // console.log("tempResume instanceof File:", tempResume instanceof File);

    // if (tempPersonalInfo.profilePic) {
    //   console.log("ProfilePic details:", {
    //     name: tempPersonalInfo.profilePic.name,
    //     size: tempPersonalInfo.profilePic.size,
    //     type: tempPersonalInfo.profilePic.type,
    //     lastModified: tempPersonalInfo.profilePic.lastModified,
    //   });
    // }

    // if (tempResume) {
    //   console.log("Resume details:", {
    //     name: tempResume.name,
    //     size: tempResume.size,
    //     type: tempResume.type,
    //     lastModified: tempResume.lastModified,
    //   });
    // }
    // console.log("=== FILE DEBUG END ===");
    if (!tempResume) {
      setErrors({ resume: "Resume is required" });
      return;
    }
    try {
      resumeSchema.parse({ resume: tempResume });
      setIsSubmitting(true);

      const formData = new FormData();

      // Append profilePic if it exists
      if (tempPersonalInfo.profilePic instanceof File) {
        formData.append("profilePic", tempPersonalInfo.profilePic);
      }

      // Append resume file
      if (tempResume) {
        formData.append("resume", tempResume);
      }

      // Handle personal info
      Object.entries(tempPersonalInfo).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          key !== "profilePic" &&
          key !== "resume"
        ) {
          if (key === "dateOfBirth") {
            formData.append(key, new Date(value).toISOString());
          } else {
            formData.append(key, String(value));
          }
        }
      });

      tempEducation.forEach((edu, index) => {
        Object.entries(edu).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            let parsedValue = value;
            const fieldName = `education[${index}][${key}]`;

            if (key === "percentage") {
              parsedValue = Number(value) || 0;
            } else if (
              key === "passedOutYear" ||
              key === "noOfActiveBacklogs"
            ) {
              parsedValue = Number(value) || 0;
            }

            formData.append(fieldName, String(parsedValue));
          }
        });
      });

      // // Log form data for debugging
      // console.log("Form Data:");
      // for (const [key, value] of formData.entries()) {
      //   if (value instanceof File) {
      //     console.log(`${key}:`, value.name, value.size, value.type);
      //   }
      //   // console.log(`${key}:`, value, typeof value);
      // }

      const res = await updateProfile(formData);
      console.log("✅ Profile updated successfully:", res);

      setIsSubmitted(true);
      resetForm(); // Clear the form after successful submission
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error("❌ Submission error:", error);
      const fieldErrors: Record<string, string> = {};
      error.errors?.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[400px]"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">
          Profile Submitted Successfully!
        </h2>
        <p className="text-gray-600 text-center">
          Your profile has been created and submitted for review.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-brand-blue-dark flex items-center space-x-2">
            <FileText className="w-6 h-6" />
            <span>Resume Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {tempResume ? (
              <div className="space-y-4">
                <FileText className="w-12 h-12 mx-auto text-brand-blue-light" />
                <div>
                  <p className="font-medium text-brand-blue-dark">
                    {tempResume.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(tempResume.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Resume
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Upload your resume
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF files only, max 3MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-brand-blue-light text-brand-blue-light hover:bg-brand-blue-light hover:text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {errors.resume && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{errors.resume}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Submission Summary
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Personal information completed</li>
              <li>
                • {tempEducation.length} education{" "}
                {tempEducation.length === 1 ? "entry" : "entries"} added
              </li>
              <li>• {tempResume ? "Resume uploaded" : "Resume pending"}</li>
              {tempPersonalInfo.profilePic && (
                <li>• Profile picture uploaded</li>
              )}
            </ul>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!tempResume || isSubmitting}
              className="bg-brand-blue-light hover:bg-brand-blue-dark"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Profile"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
