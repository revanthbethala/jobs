import React, { useState } from 'react';
import { PersonalDetailsSection } from './PersonalDetailsSection';
import { EducationSection } from './EducationSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Save, X, Upload, FileText, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfileStore } from '@/store/profileStore';
import { educationSchema, personalDetailsSchema, resumeFileSchema } from '@/schemas/profileSchema';

const Profile: React.FC = () => {
  const {
    personalDetails,
    education,
    isEditMode,
    toggleEditMode,
    saveChanges,
    cancelChanges,
    uploadResume,
  } = useProfileStore();

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    try {
      personalDetailsSchema.parse(personalDetails);

      education.forEach((edu) => {
        educationSchema.parse(edu);
      });

      setIsSaving(true);
      await saveChanges();

      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: 'Validation Error',
        description: 'Please check all fields and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    cancelChanges();
    toast({
      title: 'Changes Cancelled',
      description: 'All unsaved changes have been reverted.',
    });
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      resumeFileSchema.parse({ file });

      setIsUploading(true);
      await uploadResume(file);

      toast({
        title: 'Success',
        description: 'Resume uploaded successfully!',
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      toast({
        title: 'Upload Error',
        description: 'Please select a valid PDF file under 3MB.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 font-inter">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Professional Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-brand-gray-dark bg-gradient-to-r from-brand-blue-dark to-brand-blue-light bg-clip-text text-transparent">
                Profile Management
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Manage your professional profile and credentials
              </p>
            </div>

            <div className="flex gap-3">
              {!isEditMode ? (
                <Button
                  onClick={toggleEditMode}
                  className="bg-brand-blue-light hover:bg-brand-blue-dark transition-all duration-300 shadow-lg hover:shadow-xl h-12 px-6"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-300 hover:bg-gray-50 h-12 px-6 transition-all duration-200"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-brand-blue-light to-brand-blue-dark hover:from-brand-blue-dark hover:to-brand-blue-light transition-all duration-300 shadow-lg hover:shadow-xl h-12 px-6"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Personal Details Section */}
          <Card className="shadow-sm border-0 bg-white rounded-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8">
              <PersonalDetailsSection />
            </div>
          </Card>

          {/* Resume Section - Enhanced Display */}
          <Card className="shadow-sm border-0 bg-white rounded-2xl overflow-hidden animate-slide-in-right">
            <div className="p-8">
              <h3 className="text-xl font-bold text-brand-gray-dark mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand-blue-light" />
                Resume & Documents
              </h3>

              <div className="space-y-6">
                {personalDetails.resume && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-brand-blue-light to-brand-blue-dark rounded-xl flex items-center justify-center shadow-sm">
                          <FileText className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-brand-gray-dark text-lg">Current Resume</h4>
                          <p className="text-gray-600">PDF Document</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-brand-blue-light text-brand-blue-light hover:bg-brand-blue-light hover:text-white transition-colors"
                        >
                          <a
                            href={personalDetails.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-brand-blue-light text-brand-blue-light hover:bg-brand-blue-light hover:text-white transition-colors"
                        >
                          <a
                            href={personalDetails.resume}
                            download
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {isEditMode && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-blue-light transition-colors bg-gray-50/50">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer flex flex-col items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-brand-blue-light to-brand-blue-dark rounded-full flex items-center justify-center shadow-lg">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-brand-gray-dark text-lg">
                          {isUploading ? 'Uploading Resume...' : 'Upload New Resume'}
                        </p>
                        <p className="text-gray-600 mt-1">
                          PDF files only, maximum 3MB
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Education Section */}
          <Card className="shadow-sm border-0 bg-white rounded-2xl overflow-hidden animate-slide-in-right">
            <div className="p-8">
              <EducationSection />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Profile