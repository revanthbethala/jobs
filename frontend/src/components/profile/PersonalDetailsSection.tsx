import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Users } from "lucide-react";
import { type ProfileData } from "@/services/profileServices";

interface PersonalDetailsSectionProps {
  profile: ProfileData;
  isEditing: boolean;
  onUpdate: (field: string, value: any) => void;
}

export const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  profile,
  isEditing,
  onUpdate,
}) => {
  const renderField = (
    field: keyof ProfileData,
    label: string,
    placeholder: string,
    icon: React.ReactNode,
    isTextarea = false
  ) => (
    <div className="space-y-2">
      <Label htmlFor={field} className="text-sm font-medium">
        {label}
      </Label>
      {isEditing ? (
        isTextarea ? (
          <Textarea
            id={field}
            value={(profile[field] as string) || ""}
            onChange={(e) => onUpdate(field, e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] transition-all focus:ring-2 focus:ring-primary/20"
          />
        ) : (
          <Input
            id={field}
            value={(profile[field] as string) || ""}
            onChange={(e) => onUpdate(field, e.target.value)}
            placeholder={placeholder}
            className="transition-all focus:ring-2 focus:ring-primary/20"
          />
        )
      ) : (
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md min-h-[42px]">
          {icon}
          <span className="flex-1">
            {(profile[field] as string) || `No ${label.toLowerCase()} provided`}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Card className="shadow-card hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Personal Details</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Family Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField(
            "fatherName",
            "Father's Name",
            "Enter father's name",
            <Users className="h-4 w-4 text-muted-foreground" />
          )}

          {renderField(
            "motherName",
            "Mother's Name",
            "Enter mother's name",
            <Users className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Address Information
          </h3>

          <div className="space-y-4">
            {renderField(
              "address",
              "Street Address",
              "Enter your complete address",
              <MapPin className="h-4 w-4 text-muted-foreground" />,
              true
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderField(
                "city",
                "City",
                "Enter city",
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}

              {renderField(
                "state",
                "State/Province",
                "Enter state",
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}

              {renderField(
                "country",
                "Country",
                "Enter country",
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
