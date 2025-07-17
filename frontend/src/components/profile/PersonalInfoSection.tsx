import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, ShieldCheck, User, Phone, MapPin, Users } from "lucide-react";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { cn } from "@/lib/utils";
import {
  PersonalInfoFormData,
  personalInfoSchema,
} from "@/schemas/profileSchema";
import { ProfileData } from "@/types/profileTypes";

interface PersonalInfoSectionProps {
  profile: ProfileData;
  isEditing: boolean;
}

const PersonalInfoSection = ({
  profile,
  isEditing,
}: PersonalInfoSectionProps) => {
  const { currentStep, setCurrentStep, setTempPersonalInfo, tempPersonalInfo } =
    useProfileStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: tempPersonalInfo?.firstName ?? profile.firstName ?? "",
      lastName: tempPersonalInfo?.lastName ?? profile.lastName ?? "",
      email: tempPersonalInfo?.email ?? profile.email ?? "",
      phoneNumber: tempPersonalInfo?.phoneNumber ?? profile.phoneNumber ?? "",
      gender: tempPersonalInfo?.gender ?? profile.gender ?? "",
      username: tempPersonalInfo?.username ?? profile.username ?? "",
      fatherName: tempPersonalInfo?.fatherName ?? profile.fatherName ?? "",
      motherName: tempPersonalInfo?.motherName ?? profile.motherName ?? "",
      address: tempPersonalInfo?.address ?? profile.address ?? "",
      city: tempPersonalInfo?.city ?? profile.city ?? "",
      state: tempPersonalInfo?.state ?? profile.state ?? "",
      country: tempPersonalInfo?.country ?? profile.country ?? "",
    },
  });

  const onBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: PersonalInfoFormData) => {
    setTempPersonalInfo(data); // Save locally in Zustand
    setCurrentStep(currentStep + 1); // Move to next step
  };

  const fieldGroups = [
    {
      title: "Basic Information",
      icon: User,
      fields: [
        { key: "firstName", label: "First Name", type: "text", required: true },
        { key: "lastName", label: "Last Name", type: "text", required: true },
        {
          key: "gender",
          label: "Gender",
          type: "select", // change from text to select
          required: true,
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Prefer not to say", value: "prefer_not_to_say" },
          ],
        },
        { key: "email", label: "Email", type: "email", readOnly: true },
        // { key: "username", label: "Username", type: "text", readOnly: true },
      ],
    },
    {
      title: "Contact Information",
      icon: Phone,
      fields: [
        {
          key: "phoneNumber",
          label: "Phone Number",
          type: "tel",
          inputMode: "numeric",
          required: true,
          maxLength: 10,
        },
      ],
    },
    {
      title: "Family Information",
      icon: Users,
      fields: [
        {
          key: "fatherName",
          label: "Father's Name",
          type: "text",
          required: true,
        },
        {
          key: "motherName",
          label: "Mother's Name",
          type: "text",
          required: true,
        },
      ],
    },
    {
      title: "Address Information",
      icon: MapPin,
      fields: [
        { key: "address", label: "Address", type: "text", required: true },
        { key: "city", label: "City", type: "text", required: true },
        { key: "state", label: "State", type: "text", required: true },
        { key: "country", label: "Country", type: "text", required: true },
      ],
    },
  ];

  return (
    <motion.div
      className="space-y-5 md:px-3 px-0 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.6, delay: showAnimation ? 1.5 : 0 }}
    >
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <ProfilePictureUpload
          profilePicture={profile.profilePicture}
          isEditing={isEditing}
        />
        {/* Verified Badge */}
        <Badge
          variant={profile.isVerified ? "default" : "secondary"}
          className={cn(
            "flex items-center space-x-1",
            profile.isVerified ? "bg-green-600 hover:bg-green-600/90" : ""
          )}
        >
          {profile.isVerified ? (
            <ShieldCheck className="w-3 h-3" />
          ) : (
            <Shield className="w-3 h-3" />
          )}
          <span>{profile.isVerified ? "Verified" : "Unverified"}</span>
        </Badge>
        <div className="font-medium text-lg">{profile.username}</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fieldGroups.map((group, groupIndex) => {
          const Icon = group.icon;
          return (
            <motion.div
              key={group.title}
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {group.title}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label
                      htmlFor={field.key}
                      className={cn(
                        field.required &&
                          "after:content-['*'] after:text-destructive after:ml-1"
                      )}
                    >
                      {field.label}
                    </Label>

                    {isEditing && !field.readOnly ? (
                      field.type === "select" ? (
                        <select
                          id={field.key}
                          {...register(field.key as keyof PersonalInfoFormData)}
                          className={cn(
                            "w-full px-3 py-2 text-sm  border rounded-lg  text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            errors[field.key as keyof PersonalInfoFormData] &&
                              "border-destructive focus:ring-destructive focus:border-destructive"
                          )}
                        >
                          <option value="">Select gender</option>
                          {field.options?.map((option) => (
                            <option
                              className="px-4 rounded-lg"
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type}
                          {...register(field.key as keyof PersonalInfoFormData)}
                          className={cn(
                            errors[field.key as keyof PersonalInfoFormData] &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      )
                    ) : (
                      <div className="px-3 py-2 rounded-md border bg-muted text-muted-foreground">
                        {String(
                          profile[field.key as keyof ProfileData] ||
                            "Not provided"
                        )}
                      </div>
                    )}

                    {errors[field.key as keyof PersonalInfoFormData] && (
                      <p className="text-sm text-destructive">
                        {
                          errors[field.key as keyof PersonalInfoFormData]
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {isEditing && (
          <motion.div
            className="flex justify-between pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button type="button" onClick={onBack} variant="outline">
              ← Back
            </Button>
            <Button
              type="submit"
              className="bg-brand-blue-light hover:bg-brand-blue-light/90"
            >
              Next →
            </Button>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default PersonalInfoSection;
