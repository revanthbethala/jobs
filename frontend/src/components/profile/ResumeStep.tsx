import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useProfileStore } from "@/store/profileStore";
import { resumeSchema } from "@/schemas/profileSchema";
import { updateProfile } from "@/services/profileService";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export default function ResumeStep() {
  const navigate = useNavigate();
  const {
    tempResume,
    setResume,
    setCurrentStep,
    resumeUrl,
    tempPersonalInfo,
    tempEducation,
  } = useProfileStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumePreview, setResumePreview] = useState<boolean | null>(
    !!resumeUrl
  );
  const handleDeleteResume = () => {
    setResume(null);
    setErrors({});
  };
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

      // Log form data for debugging
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, value.size, value.type);
        }
        // console.log(`${key}:`, value, typeof value);
      }

      const res = await updateProfile(formData);
      console.log("✅ Profile updated successfully:", res);
      console.log(formData);
      setIsSubmitted(true);
      toast({ title: "Profile updated successfully!" });
      setTimeout(() => setIsSubmitted(false), 3000);
      navigate("/profile");
      setCurrentStep(1);
    } catch (error) {
      console.error("❌ Submission error:", error);
      const fieldErrors: Record<string, string> = {};
      error.errors?.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
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
          Your profile has been updated successfully
        </p>
        <Button>View Profile</Button>
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
      <Card className="w-full max-w-[90%] sm:max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-brand-blue-dark flex items-center space-x-2 justify-center sm:justify-start text-center">
            <FileText className="w-6 h-6" />
            <span>Resume Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumePreview ? (
            <div className="text-center">
              <Button size="sm">
                <a
                  href={import.meta.env.VITE_BACKEND_URL + resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Uploaded Resume
                </a>
              </Button>
              <Button
                variant="outline"
                className="flex gap-2"
                onClick={() => setResumePreview(false)}
              >
                <Upload /> Upload Resume
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
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
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      Change Resume
                    </Button>
                    <Button
                      onClick={handleDeleteResume}
                      variant="destructive"
                      className="w-full sm:w-auto"
                    >
                      Delete Resume
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-base sm:text-lg font-medium text-gray-700">
                      Upload your resume
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF files only, max 3MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    disabled
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
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              // disabled={!tempResume || isSubmitting || !resumeUrl}
              className="w-full sm:w-auto bg-brand-blue-light hover:bg-brand-blue-dark"
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
