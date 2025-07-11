import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Building,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";
import {
  type ProfileData,
  type EducationItem,
} from "@/services/profileServices";

interface EducationSectionProps {
  profile: ProfileData;
  isEditing: boolean;
  onUpdate: (field: string, value: any) => void;
}

const educationLevels = [
  "10th",
  "12th",
  "Diploma",
  "B.Tech",
  "B.E.",
  "B.Sc",
  "B.Com",
  "B.A.",
  "M.Tech",
  "M.E.",
  "M.Sc",
  "M.Com",
  "M.A.",
  "MBA",
  "PhD",
  "Other",
];

export const EducationSection: React.FC<EducationSectionProps> = ({
  profile,
  isEditing,
  onUpdate,
}) => {
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<Partial<EducationItem>>({});

  const education = profile.education || [];

  const addEducation = () => {
    const newItem: EducationItem = {
      id: Date.now().toString(),
      level: newEducation.level || "",
      institution: newEducation.institution || "",
      specialization: newEducation.specialization || "",
      board: newEducation.board || "",
      cgpa: newEducation.cgpa || "",
      percentage: newEducation.percentage || "",
      passedYear: newEducation.passedYear || "",
      location: newEducation.location || "",
      activeBacklogs: newEducation.activeBacklogs || 0,
    };

    const updatedEducation = [...education, newItem];
    onUpdate("education", updatedEducation);
    setNewEducation({});
    setEditingEducation(null);
  };

  const updateEducation = (id: string, updatedItem: Partial<EducationItem>) => {
    const updatedEducation = education.map((item) =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    onUpdate("education", updatedEducation);
  };

  const deleteEducation = (id: string) => {
    const updatedEducation = education.filter((item) => item.id !== id);
    onUpdate("education", updatedEducation);
  };

  const EducationCard: React.FC<{ item: EducationItem; isNew?: boolean }> = ({
    item,
    isNew = false,
  }) => {
    const [editData, setEditData] = useState<Partial<EducationItem>>(item);
    const isEditable = isEditing && (editingEducation === item.id || isNew);

    const handleSave = () => {
      if (isNew) {
        setNewEducation(editData);
        addEducation();
      } else {
        updateEducation(item.id!, editData);
        setEditingEducation(null);
      }
    };

    const handleCancel = () => {
      setEditData(item);
      setEditingEducation(null);
      if (isNew) {
        setNewEducation({});
      }
    };

    return (
      <Card className="border-l-4 border-l-primary/30 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="pt-6">
          {isEditable ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Educational Level *
                  </Label>
                  <Select
                    value={editData.level || ""}
                    onValueChange={(value) =>
                      setEditData((prev) => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Institution *</Label>
                  <Input
                    value={editData.institution || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        institution: e.target.value,
                      }))
                    }
                    placeholder="School/College name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Specialization</Label>
                  <Input
                    value={editData.specialization || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        specialization: e.target.value,
                      }))
                    }
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Board/University *
                  </Label>
                  <Input
                    value={editData.board || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        board: e.target.value,
                      }))
                    }
                    placeholder="Board or University"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">CGPA</Label>
                  <Input
                    value={editData.cgpa || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, cgpa: e.target.value }))
                    }
                    placeholder="e.g., 8.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Percentage</Label>
                  <Input
                    value={editData.percentage || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        percentage: e.target.value,
                      }))
                    }
                    placeholder="e.g., 85%"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Passed Year *</Label>
                  <Input
                    value={editData.passedYear || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        passedYear: e.target.value,
                      }))
                    }
                    placeholder="e.g., 2023"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Location</Label>
                  <Input
                    value={editData.location || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="City, State"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium">Active Backlogs</Label>
                  <Input
                    type="number"
                    min="0"
                    value={editData.activeBacklogs || 0}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        activeBacklogs: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Number of pending subjects"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave} size="sm">
                  {isNew ? "Add" : "Save"}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.level}
                      {item.specialization && ` in ${item.specialization}`}
                    </h3>
                    {item.activeBacklogs > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {item.activeBacklogs} Backlogs
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{item.institution}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{item.board}</span>
                    </div>

                    {item.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{item.location}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Graduated in {item.passedYear}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {(item.cgpa || item.percentage) && (
                    <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {item.cgpa
                          ? `${item.cgpa} CGPA`
                          : `${item.percentage}%`}
                      </span>
                    </div>
                  )}

                  {isEditing && (
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEducation(item.id!)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteEducation(item.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="shadow-card hover:shadow-md transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span>Education</span>
          </CardTitle>

          {isEditing && !editingEducation && (
            <Button
              onClick={() => setEditingEducation("new")}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Education</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {education.length === 0 && !editingEducation ? (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No education information added yet</p>
            {isEditing && (
              <Button
                onClick={() => setEditingEducation("new")}
                variant="outline"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Education
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {editingEducation === "new" && (
              <EducationCard
                item={newEducation as EducationItem}
                isNew={true}
              />
            )}

            {education.map((item) => (
              <EducationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
