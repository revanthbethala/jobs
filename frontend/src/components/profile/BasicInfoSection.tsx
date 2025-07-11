import React, { useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Camera,
  User,
  Mail,
  Phone,
  AtSign,
  Crop as CropIcon,
  Upload,
} from "lucide-react";
import { uploadFile, type ProfileData } from "@/services/profileServices";
import { useToast } from "@/hooks/use-toast";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useProfileStore } from "@/store/profileStore";

interface BasicInfoSectionProps {
  profile: ProfileData;
  isEditing: boolean;
  onUpdate: (field: string, value: any) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  profile,
  isEditing,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();
  const [showCropDialog, setShowCropDialog] = useState(false);
  console.log("Profile data",profile);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result?.toString() || "");
      setShowCropDialog(true);
    });
    reader.readAsDataURL(file);
  };

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            }
          },
          "image/jpeg",
          0.95
        );
      });
    },
    []
  );

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    try {
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop
      );
      const croppedFile = new File([croppedImageBlob], "profile-picture.jpg", {
        type: "image/jpeg",
      });

      const imageUrl = await uploadFile(croppedFile, "profilePicture");
      onUpdate("profilePicture", imageUrl);
      setShowCropDialog(false);
      setImgSrc("");

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture",
      });
    }
  };

  const getInitials = () => {
    return `${profile.firstName?.[0] || ""}${
      profile.lastName?.[0] || ""
    }`.toUpperCase();
  };

  const getRoleBadge = () => {
    const variant = profile.role === "ADMIN" ? "default" : "secondary";
    const label = profile.role === "ADMIN" ? "Admin" : "Candidate";
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <Card className="shadow-card hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <span>Basic Information</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg cursor-pointer transition-all duration-300 group-hover:shadow-xl">
              <AvatarImage src={profile.profilePicture} alt="Profile" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <>
                <div
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-foreground">
                {profile.firstName} {profile.lastName}
              </h2>
              {getRoleBadge()}
            </div>
            <p className="text-muted-foreground">
              {profile.username ? `@${profile.username}` : "No username set"}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name *
            </Label>
            {isEditing ? (
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => onUpdate("firstName", e.target.value)}
                placeholder="Enter first name"
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{profile.firstName}</span>
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name *
            </Label>
            {isEditing ? (
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => onUpdate("lastName", e.target.value)}
                placeholder="Enter last name"
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{profile.lastName}</span>
              </div>
            )}
          </div>

          {/* Email (Non-editable) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-md border">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{profile.email}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={profile.phone || ""}
                onChange={(e) => onUpdate("phone", e.target.value)}
                placeholder="Enter phone number"
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.phone || "Not provided"}</span>
              </div>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            {isEditing ? (
              <Input
                id="username"
                value={profile?.username}
                disabled
                // onChange={(e) => onUpdate("username", e.target.value)}
                placeholder="Choose a unique username"
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <span>{profile.username || "Not set"}</span>
              </div>
            )}
            {isEditing && (
              <p className="text-xs text-muted-foreground">
                Username can only be set once. Choose carefully.
              </p>
            )}
          </div>
        </div>
      </CardContent>

      {/* Image Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CropIcon className="h-5 w-5 text-primary" />
              <span>Crop Profile Picture</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  className="max-h-96 w-auto"
                />
              </ReactCrop>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCropDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCropComplete}
                className="bg-primary hover:bg-primary/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
