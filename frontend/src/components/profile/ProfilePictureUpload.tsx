import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/services/profileService";
import { mockUploadFile } from "@/services/mockFileUpload";
import { useProfileStore } from "@/store/profileStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Toggle to use mock upload
const USE_MOCK_UPLOAD = true;

interface ProfilePictureUploadProps {
  profilePicture?: string;
  isEditing: boolean;
  showAnimation: boolean;
}

const ProfilePictureUpload = ({
  profilePicture,
  isEditing,
}: ProfilePictureUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { updateProfile, setProfilePictureAnimationComplete } =
    useProfileStore();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const imageUrl = USE_MOCK_UPLOAD
        ? await mockUploadFile(file, "profilePicture")
        : await uploadFile(file, "profilePicture");
      await updateProfile();
      setPreviewUrl(null);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setPreviewUrl(null);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentImage = previewUrl || profilePicture;

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        className="relative"
        // initial={showAnimation ? { scale: 0.8, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          ease: [0.4, 0, 0.2, 1],
          onComplete: () => setProfilePictureAnimationComplete(true),
        }}
      >
        <div className="relative">
          <motion.div
            className={cn(
              "w-36 h-36 rounded-full border-4 border-brand-blue-light overflow-hidden "
            )}
            whileHover={isEditing ? { scale: 1.08, y: -4 } : {}}
            transition={{
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </motion.div>

          {/* Upload/Edit Button */}
          {isEditing && (
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`absolute bottom-0 right-0 w-10 h-10 rounded-full
  bg-brand-blue-light text-brand-blue-light-foreground border-2 border-background
  flex items-center justify-center shadow-soft
  hover:scale-110 transition-transform
  ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="w-4 h-4b text-white" />
            </motion.button>
          )}

          {/* Preview Remove Button */}
          {previewUrl && (
            <motion.button
              onClick={handleRemovePreview}
              className={cn(
                "absolute top-0 right-0 w-6 h-6 rounded-full",
                "bg-destructive text-destructive-foreground",
                "flex items-center justify-center",
                "hover:scale-110 transition-transform"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-3 h-3" />
            </motion.button>
          )}
        </div>

        {isUploading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload button for non-editing mode */}
      {!isEditing && !currentImage && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
      )}

      {isUploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
