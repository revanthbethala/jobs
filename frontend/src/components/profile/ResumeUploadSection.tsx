import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profileStore";
import { useNavigate, useParams } from "react-router-dom";
import { applyJob } from "@/services/jobServices";

const ResumeUploadSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    tempResume,
    isEditing,
    setTempResume,
    setCurrentStep,
    updateProfile,
    setEditing,
    forceEditing,
    fetchProfile
  } = useProfileStore();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a PDF file smaller than 3MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // const resumeUrl = await uploadFile(file, "resume");
      const resumeUrl =
        "https://imgs.search.brave.com/xlfqxb13HWmf6vJkyEshElDmDh1XDri1WnVlTCuRYas/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWd2/My5mb3Rvci5jb20v/aW1hZ2VzL2dhbGxl/cnkvZ2VuZXJhdGUt/YS1jeWJlcnB1bmst/YWktYXZhdGFyLW9m/LWEtbWFsZS1pbi1m/b3Rvci5qcGc";

      setTempResume(resumeUrl);
      setUploadProgress(100);

      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveResume = () => {
    setTempResume("");
    toast({
      title: "Success",
      description: "Resume removed",
    });
  };

  const handleDownload = () => {
    if (tempResume) {
      window.open(tempResume, "_blank");
    }
  };

  const handleView = () => {
    if (tempResume) {
      window.open(tempResume, "_blank");
    }
  };
  const navigate = useNavigate();
  const { id } = useParams();
  const handleBack = () => {
    setCurrentStep(1); // assuming 0: personal, 1: education, 2: resume
  };
  console.log(forceEditing);
  const handleSubmit = async () => {
    await updateProfile();
    // if (forceEditing) {
    //   const res = await applyJob(id);
    //   console.log(res);
    //   navigate("/jobs");
    // } else {
    setCurrentStep(0);
    setEditing(false);
  fetchProfile()
  };

  return (
    <motion.div
      className="space-y-6 px-4 sm:px-6 md:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Resume Upload
        </h2>
      </div>

      {/* Main Card */}
      <Card className="shadow-soft w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <FileText className="w-5 h-5" />
            <span>Resume Document</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              Please upload your resume in PDF format only. Max file size: 3MB.
            </AlertDescription>
          </Alert>

          {/* Resume Uploaded Preview */}
          {tempResume ? (
            <motion.div
              className="space-y-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={cn(
                  "border-2 border-dashed border-success rounded-lg p-4 sm:p-6",
                  "bg-success/5 transition-colors"
                )}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">
                        Resume.pdf
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        PDF Document
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-success">
                      Uploaded
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleView} variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                  <span className="ml-1">View</span>
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                  <span className="ml-1">Download</span>
                </Button>
                {isEditing && (
                  <>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4" />
                      <span className="ml-1">Replace</span>
                    </Button>
                    <Button
                      onClick={handleRemoveResume}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={isUploading}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="ml-1">Remove</span>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            // Empty Resume Block
            <motion.div
              className={cn(
                "border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 sm:p-8",
                "text-center transition-colors hover:border-primary/50",
                isEditing && "cursor-pointer"
              )}
              onClick={
                isEditing ? () => fileInputRef.current?.click() : undefined
              }
              whileHover={isEditing ? { scale: 1.02 } : {}}
              whileTap={isEditing ? { scale: 0.98 } : {}}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium text-foreground mb-1">
                    {isEditing ? "Upload your resume" : "No resume uploaded"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isEditing
                      ? "Click to browse or drag and drop your PDF here"
                      : "Upload your resume to improve your profile visibility"}
                  </p>
                </div>
                {isEditing && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <div className="flex items-center justify-between text-sm">
                <span>Uploading resume...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <motion.div
                  className="bg-brand-blue-light h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Navigation Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUploading}
            className="w-full bg-brand-blue-dark hover:bg-brand-blue-dark/90 sm:w-auto"
          >
            {forceEditing ? " Update Profile & Apply" : "Update Profile"}
          </Button>
        </div>
      )}
    </motion.div>
  );
};
export default ResumeUploadSection;
