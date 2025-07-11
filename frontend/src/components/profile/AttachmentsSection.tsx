import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Paperclip,
  Upload,
  FileText,
  Download,
  Eye,
  Camera,
  User,
} from "lucide-react";
import { uploadFile, type ProfileData } from "@/services/profileServices";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore } from "@/store/profileStore";

interface AttachmentsSectionProps {
  profile: ProfileData;
  isEditing: boolean;
  onUpdate: (field: string, value: unknown) => void;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  profile,
  isEditing,
  onUpdate,
}) => {
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "profilePicture"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file types
    if (type === "resume") {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF or Word document for resume",
        });
        return;
      }
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a JPEG or PNG image",
        });
        return;
      }
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
      });
      return;
    }

    try {
      const fileUrl = await uploadFile(file, type);
      onUpdate(type, fileUrl);

      toast({
        title: "Success",
        description: `${
          type === "resume" ? "Resume" : "Profile picture"
        } uploaded successfully`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: `Failed to upload ${
          type === "resume" ? "resume" : "profile picture"
        }`,
      });
    }
  };

  const getFileSize = (url: string): string => {
    // Mock file size - in real implementation, you'd get this from the server
    return "2.3 MB";
  };

  const getFileName = (
    url: string,
    type: "resume" | "profilePicture"
  ): string => {
    if (!url) return "";

    // Extract filename from URL or generate a default name
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];

    if (fileName && fileName.includes(".")) {
      return fileName;
    }

    return type === "resume"
      ? `${profile.firstName}_${profile.lastName}_Resume.pdf`
      : `${profile.firstName}_${profile.lastName}_Photo.jpg`;
  };

  const AttachmentCard: React.FC<{
    title: string;
    description: string;
    fileUrl?: string;
    onUpload: () => void;
    icon: React.ReactNode;
    type: "resume" | "profilePicture";
  }> = ({ title, description, fileUrl, onUpload, icon, type }) => (
    <Card className="border border-border hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>

            {fileUrl ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {getFileName(fileUrl, type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getFileSize(fileUrl)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(fileUrl, "_blank")}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = fileUrl;
                        link.download = getFileName(fileUrl, type);
                        link.click();
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isEditing && (
                  <Button
                    onClick={onUpload}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Update {title}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 border-2 border-dashed border-border rounded-lg text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No {title.toLowerCase()} uploaded
                  </p>
                </div>

                {isEditing && (
                  <Button
                    onClick={onUpload}
                    className="w-full"
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {title}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="shadow-card hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Paperclip className="h-5 w-5 text-primary" />
          <span>Attachments</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Resume */}
        <AttachmentCard
          title="Resume"
          description="Upload your latest resume (PDF, DOC, DOCX - Max 5MB)"
          fileUrl={profile.resume}
          onUpload={() => resumeInputRef.current?.click()}
          icon={<FileText className="h-6 w-6 text-primary" />}
          type="resume"
        />

        {/* Profile Picture */}
      

        {/* File Upload Status */}
        {isEditing && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">
                Upload Guidelines
              </span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Resume: PDF, DOC, DOCX formats only</li>
              <li>• Profile Picture: JPEG, PNG formats only</li>
              <li>• Maximum file size: 5MB per file</li>
              <li>• Files are automatically saved when uploaded</li>
            </ul>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={resumeInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileUpload(e, "resume")}
          className="hidden"
        />

        <input
          ref={photoInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload(e, "profilePicture")}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};
