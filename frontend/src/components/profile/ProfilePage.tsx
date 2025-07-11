import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit, Save, X } from "lucide-react";
import { getProfile, updateProfile } from "@/services/profileServices";
import { useProfileStore } from "@/store/profileStore";
import { BasicInfoSection } from "./BasicInfoSection";
import { PersonalDetailsSection } from "./PersonalDetailsSection";
import { EducationSection } from "./EducationSection";
import { AttachmentsSection } from "./AttachmentsSection";

 const ProfilePage: React.FC = () => {
  const {
    profile,
    isLoading,
    isEditing,
    isSaving,
    editedProfile,
    setProfile,
    setLoading,
    setEditing,
    setSaving,
    setEditedProfile,
    updateField,
    resetEditedProfile,
    getDisplayProfile,
  } = useProfileStore();
  const { toast } = useToast();

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setEditing(false);
    resetEditedProfile();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedData = await updateProfile(editedProfile);
      setProfile(updatedData);
      setEditing(false);
      resetEditedProfile();

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load profile data</p>
        </Card>
      </div>
    );
  }

  const displayProfile = getDisplayProfile();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profile</h1>
              <p className="text-primary-foreground/80">
                Manage your professional information
              </p>
            </div>

            {/* Edit Controls */}
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  variant="secondary"
                  className="bg-blue-600 border-white/20 text-white hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className=" border-white/20 text-black border border-gray-600 hover:bg-white/20"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 text-white hover:bg-blue-600/90"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <BasicInfoSection
              profile={displayProfile}
              isEditing={isEditing}
              onUpdate={updateField}
            />

            {/* Personal Details */}
            <PersonalDetailsSection
              profile={displayProfile}
              isEditing={isEditing}
              onUpdate={updateField}
            />

            {/* Education */}
            <EducationSection
              profile={displayProfile}
              isEditing={isEditing}
              onUpdate={updateField}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Attachments */}
            <AttachmentsSection
              profile={displayProfile}
              isEditing={isEditing}
              onUpdate={updateField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage