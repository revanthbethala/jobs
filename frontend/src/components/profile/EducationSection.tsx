import React from 'react';
import { EducationCard } from './EducationCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import { Education } from '@/schemas/profileSchema';

export const EducationSection: React.FC = () => {
  const { education, isEditMode, addEducation } = useProfileStore();

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      educationalLevel: '',
      schoolOrCollege: '',
      specialization: '',
      boardOrUniversity: '',
      percentage: 0,
      passedOutYear: new Date().getFullYear(),
      location: '',
    };
    addEducation(newEducation);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-brand-gray-dark">
          Education Details
        </h3>
        {isEditMode && (
          <Button
            onClick={handleAddEducation}
            variant="outline"
            size="sm"
            className="border-brand-blue-light text-brand-blue-light hover:bg-brand-blue-light hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {education.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No education details added yet.</p>
            {isEditMode && (
              <Button
                onClick={handleAddEducation}
                variant="outline"
                className="mt-4 border-brand-blue-light text-brand-blue-light hover:bg-brand-blue-light hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Education
              </Button>
            )}
          </div>
        ) : (
          education.map((edu, index) => (
            <div
              key={edu.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EducationCard education={edu} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
