import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, GraduationCap } from 'lucide-react';
import { Education } from '@/schemas/profileSchema';
import { useProfileStore } from '@/store/profileStore';

interface EducationCardProps {
  education: Education;
}

export const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  const { isEditMode, updateEducation, removeEducation } = useProfileStore();

  const handleInputChange = (field: keyof Education, value: string | number) => {
    updateEducation(education.id, { [field]: value });
  };

  const educationLevels = [
    'High School',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'MBA',
    'BPharmacy',
    'MPharmacy',
    'PharmD',
    'PhD',
    'Other',
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: (currentYear + 10) - 1950 + 1 }, (_, i) => currentYear + 10 - i);

  return (
    <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-blue-light to-brand-blue-dark rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-lg text-brand-gray-dark">
                {education.educationalLevel || 'Education Level'}
              </h4>
              <p className="text-sm text-gray-600">
                {education.schoolOrCollege || 'School/College Name'}
              </p>
            </div>
          </div>
          {isEditMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(education.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-brand-gray-dark">
              Education Level
            </Label>
            {isEditMode ? (
              <Select
                value={education.educationalLevel}
                onValueChange={(value) => handleInputChange('educationalLevel', value)}
              >
                <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl z-50">
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level} className="hover:bg-blue-50">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                {education.educationalLevel}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-brand-gray-dark">
              School/College
            </Label>
            {isEditMode ? (
              <Input
                type="text"
                value={education.schoolOrCollege}
                onChange={(e) => handleInputChange('schoolOrCollege', e.target.value)}
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                placeholder="Enter school/college name"
              />
            ) : (
              <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                {education.schoolOrCollege}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-brand-gray-dark">
              Specialization
            </Label>
            {isEditMode ? (
              <Input
                type="text"
                value={education.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                placeholder="Enter specialization"
              />
            ) : (
              <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                {education.specialization}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-brand-gray-dark">
              Board/University
            </Label>
            {isEditMode ? (
              <Input
                type="text"
                value={education.boardOrUniversity}
                onChange={(e) => handleInputChange('boardOrUniversity', e.target.value)}
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                placeholder="Enter board/university"
              />
            ) : (
              <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                {education.boardOrUniversity}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-brand-gray-dark">
              Percentage/Grade
            </Label>
            {isEditMode ? (
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={education.percentage}
                onChange={(e) => handleInputChange('percentage', parseFloat(e.target.value) || 0)}
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                placeholder="Enter percentage"
              />
            ) : (
              <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                {education.percentage}%
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-brand-gray-dark">
              Year of Passing
            </Label>
            {isEditMode ? (
              <Select
                value={education.passedOutYear.toString()}
                onValueChange={(value) => handleInputChange('passedOutYear', parseInt(value))}
              >
                <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl z-50 max-h-60">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="hover:bg-blue-50">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                {education.passedOutYear}
              </div>
            )}
          </div>

          <div className="space-y-3 md:col-span-2">
            <Label className="text-sm font-semibold text-brand-gray-dark">
              Location
            </Label>
            {isEditMode ? (
              <Input
                type="text"
                value={education.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-brand-blue-light border-gray-300"
                placeholder="Enter location"
              />
            ) : (
              <div className="py-3 px-4 bg-gray-50 rounded-lg text-brand-gray-dark font-medium">
                {education.location}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
