import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageCropper } from './ImageCropper';
import { Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfileStore } from '@/store/profileStore';
import { profilePhotoSchema } from '@/schemas/profileSchema';

export const PersonalDetailsSection: React.FC = () => {
  const { personalDetails, isEditMode, setPersonalDetails, uploadProfilePhoto } = useProfileStore();
  const { toast } = useToast();
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setPersonalDetails({ [field]: value });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      profilePhotoSchema.parse({ file });
      
      const imageUrl = URL.createObjectURL(file);
      setTempImageUrl(imageUrl);
      setShowCropper(true);
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: 'Upload Error',
        description: 'Please select a valid image file under 3MB.',
        variant: 'destructive',
      });
    }
    
    event.target.value = '';
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    try {
      setIsUploadingPhoto(true);
      await uploadProfilePhoto(croppedImageUrl);
      
      toast({
        title: 'Success',
        description: 'Profile photo updated successfully!',
      });
    } catch (error) {
      console.error('Photo save error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile photo.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingPhoto(false);
      setShowCropper(false);
      URL.revokeObjectURL(tempImageUrl);
    }
  };

  const getInitials = () => {
    return `${personalDetails.firstName[0] || ''}${personalDetails.lastName[0] || ''}`.toUpperCase();
  };

  return (
    <div>
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <Avatar className="w-24 h-24 ring-4 ring-blue-100">
            <AvatarImage src={personalDetails.profilePic} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-brand-blue-light to-brand-blue-dark text-white text-2xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {isEditMode && (
            <div className="absolute -bottom-2 -right-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
                disabled={isUploadingPhoto}
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer w-8 h-8 bg-brand-blue-light hover:bg-brand-blue-dark rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
              >
                <Camera className="w-4 h-4" />
              </label>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-brand-gray-dark">
            {personalDetails.firstName} {personalDetails.lastName}
          </h3>
          <p className="text-gray-600 text-lg">{personalDetails.email}</p>
          <p className="text-gray-500">{personalDetails.phoneNumber}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand-blue-light/5 to-brand-blue-dark/5 rounded-xl p-1 mb-6">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-xl font-bold text-brand-gray-dark mb-6 flex items-center gap-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-sm font-semibold text-brand-gray-dark">
                First Name
              </Label>
              {isEditMode ? (
                <Input
                  id="firstName"
                  type="text"
                  value={personalDetails.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.firstName}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="lastName" className="text-sm font-semibold text-brand-gray-dark">
                Last Name
              </Label>
              {isEditMode ? (
                <Input
                  id="lastName"
                  type="text"
                  value={personalDetails.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.lastName}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-brand-gray-dark">
                Email
              </Label>
              {isEditMode ? (
                <Input
                  id="email"
                  type="email"
                  value={personalDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.email}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="phoneNumber" className="text-sm font-semibold text-brand-gray-dark">
                Phone Number
              </Label>
              {isEditMode ? (
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={personalDetails.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.phoneNumber}
                </div>
              )}
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="address" className="text-sm font-semibold text-brand-gray-dark">
                Address
              </Label>
              {isEditMode ? (
                <Input
                  id="address"
                  type="text"
                  value={personalDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.address}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="city" className="text-sm font-semibold text-brand-gray-dark">
                City
              </Label>
              {isEditMode ? (
                <Input
                  id="city"
                  type="text"
                  value={personalDetails.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.city}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="state" className="text-sm font-semibold text-brand-gray-dark">
                State
              </Label>
              {isEditMode ? (
                <Input
                  id="state"
                  type="text"
                  value={personalDetails.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.state}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="country" className="text-sm font-semibold text-brand-gray-dark">
                Country
              </Label>
              {isEditMode ? (
                <Input
                  id="country"
                  type="text"
                  value={personalDetails.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.country}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="fatherName" className="text-sm font-semibold text-brand-gray-dark">
                Father's Name
              </Label>
              {isEditMode ? (
                <Input
                  id="fatherName"
                  type="text"
                  value={personalDetails.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.fatherName}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="motherName" className="text-sm font-semibold text-brand-gray-dark">
                Mother's Name
              </Label>
              {isEditMode ? (
                <Input
                  id="motherName"
                  type="text"
                  value={personalDetails.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                  {personalDetails.motherName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ImageCropper
        isOpen={showCropper}
        onClose={() => {
          setShowCropper(false);
          URL.revokeObjectURL(tempImageUrl);
        }}
        onCrop={handleCropComplete}
        imageUrl={tempImageUrl}
      />
    </div>
  );
};
