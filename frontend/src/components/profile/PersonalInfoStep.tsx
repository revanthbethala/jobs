import type React from "react";

import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, User } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfileStore } from "@/store/profileStore";
import { personalInfoSchema } from "@/schemas/profileSchema";

export default function PersonalInfoStep() {
  const { tempPersonalInfo, updatePersonalInfo, profileUrl, setCurrentStep } =
    useProfileStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [showProfilePic, setShowProfilePic] = useState<boolean>(!!profileUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePic: "Profile picture must be less than 2MB",
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profilePic: "Profile picture must be an image",
        }));
        return;
      }

      updatePersonalInfo({ profilePic: file });
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Clear any previous errors
      if (errors.profilePic) {
        setErrors((prev) => ({ ...prev, profilePic: "" }));
      }
    }
  };
  const handleDeletePic = () => {
    updatePersonalInfo({ profilePic: null });
    setProfilePreview(null);
    if (profileUrl) setShowProfilePic(true);
    if (errors.profilePic) {
      setErrors((prev) => ({ ...prev, profilePic: "" }));
    }
  };
  const handleNext = () => {
    try {
      personalInfoSchema.parse(tempPersonalInfo);
      setCurrentStep(2);
    } catch (error) {
      const fieldErrors: Record<string, string> = {};
      error.errors?.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-brand-blue-dark">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {showProfilePic ? (
                <img
                  src={import.meta.env.VITE_BACKEND_URL + profileUrl}
                  alt="profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-brand-blue-light"
                />
              ) : (
                <span>
                  {profilePreview ? (
                    <img
                      src={profilePreview || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-brand-blue-light"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </span>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                fileInputRef.current?.click();
                setShowProfilePic(false);
              }}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Profile Picture</span>
            </Button>
            {tempPersonalInfo.profilePic && (
              <Button
                onClick={handleDeletePic}
                className="text-sm "
                variant="destructive"
              >
                Remove Profile Pic
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {errors.profilePic && (
              <p className="text-red-500 text-sm text-center">
                {errors.profilePic}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Non-editable fields */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={tempPersonalInfo.username || ""}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={tempPersonalInfo.email || ""}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Editable fields */}
            <div className="space-y-2">
              <Label htmlFor="collegeId">College ID</Label>
              <Input
                id="collegeId"
                value={tempPersonalInfo.collegeId || ""}
                onChange={(e) => handleInputChange("collegeId", e.target.value)}
                className={errors.collegeId ? "border-red-500" : ""}
              />
              {errors.collegeId && (
                <p className="text-red-500 text-sm">{errors.collegeId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={tempPersonalInfo.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={tempPersonalInfo.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={tempPersonalInfo.gender || ""}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger
                  className={errors.gender ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Prefer not to say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={tempPersonalInfo.dateOfBirth || ""}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className={errors.dateOfBirth ? "border-red-500" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={tempPersonalInfo.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                value={tempPersonalInfo.fatherName || ""}
                onChange={(e) =>
                  handleInputChange("fatherName", e.target.value)
                }
                className={errors.fatherName ? "border-red-500" : ""}
              />
              {errors.fatherName && (
                <p className="text-red-500 text-sm">{errors.fatherName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name</Label>
              <Input
                id="motherName"
                value={tempPersonalInfo.motherName || ""}
                onChange={(e) =>
                  handleInputChange("motherName", e.target.value)
                }
                className={errors.motherName ? "border-red-500" : ""}
              />
              {errors.motherName && (
                <p className="text-red-500 text-sm">{errors.motherName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={tempPersonalInfo.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={tempPersonalInfo.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={tempPersonalInfo.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={tempPersonalInfo.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
              rows={3}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              className="bg-brand-blue-light hover:bg-brand-blue-dark"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
