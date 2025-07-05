import { Education, PersonalDetails } from '@/schemas/profileSchema';
import { create } from 'zustand';

interface ProfileState {
    personalDetails: PersonalDetails;
    education: Education[];
    isEditMode: boolean;
    originalData: {
        personalDetails: PersonalDetails;
        education: Education[];
    };

    // Actions
    setPersonalDetails: (details: Partial<PersonalDetails>) => void;
    setEducation: (education: Education[]) => void;
    addEducation: (education: Education) => void;
    removeEducation: (id: string) => void;
    updateEducation: (id: string, education: Partial<Education>) => void;
    toggleEditMode: () => void;
    saveChanges: () => Promise<void>;
    cancelChanges: () => void;
    uploadResume: (file: File) => Promise<void>;
    uploadProfilePhoto: (photoUrl: string) => Promise<void>;
}

// Mock initial data with sample resume and profile photo
const initialPersonalDetails: PersonalDetails = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    fatherName: 'Robert Doe',
    motherName: 'Jane Doe',
    profilePic: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
    resume: '',
};

const initialEducation: Education[] = [
    {
        id: '1',
        educationalLevel: 'Bachelor\'s Degree',
        schoolOrCollege: 'University of Technology',
        specialization: 'Computer Science',
        boardOrUniversity: 'State University Board',
        percentage: 85.5,
        passedOutYear: 2020,
        location: 'New York, NY',
    },
    {
        id: '2',
        educationalLevel: 'High School',
        schoolOrCollege: 'Central High School',
        specialization: 'Science',
        boardOrUniversity: 'State Board of Education',
        percentage: 92.0,
        passedOutYear: 2016,
        location: 'New York, NY',
    },
];

export const useProfileStore = create<ProfileState>((set, get) => ({
    personalDetails: initialPersonalDetails,
    education: initialEducation,
    isEditMode: false,
    originalData: {
        personalDetails: initialPersonalDetails,
        education: initialEducation,
    },

    setPersonalDetails: (details) =>
        set((state) => ({
            personalDetails: { ...state.personalDetails, ...details },
        })),

    setEducation: (education) => set({ education }),

    addEducation: (education) =>
        set((state) => ({
            education: [...state.education, education],
        })),

    removeEducation: (id) =>
        set((state) => ({
            education: state.education.filter((edu) => edu.id !== id),
        })),

    updateEducation: (id, updatedEducation) =>
        set((state) => ({
            education: state.education.map((edu) =>
                edu.id === id ? { ...edu, ...updatedEducation } : edu
            ),
        })),

    toggleEditMode: () =>
        set((state) => {
            if (!state.isEditMode) {
                return {
                    isEditMode: true,
                    originalData: {
                        personalDetails: { ...state.personalDetails },
                        education: [...state.education],
                    },
                };
            } else {
                return { isEditMode: false };
            }
        }),

    saveChanges: async () => {
        const state = get();

        console.log('Saving profile data:', {
            personalDetails: state.personalDetails,
            education: state.education,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        set({
            isEditMode: false,
            originalData: {
                personalDetails: { ...state.personalDetails },
                education: [...state.education],
            },
        });
    },

    cancelChanges: () =>
        set((state) => ({
            isEditMode: false,
            personalDetails: { ...state.originalData.personalDetails },
            education: [...state.originalData.education],
        })),

    uploadResume: async (file) => {
        console.log('Uploading resume:', file.name);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const mockResumeUrl = `https://example.com/resumes/${file.name}`;

        set((state) => ({
            personalDetails: {
                ...state.personalDetails,
                resume: mockResumeUrl,
            },
        }));
    },

    uploadProfilePhoto: async (photoUrl) => {
        console.log('Uploading profile photo');

        await new Promise((resolve) => setTimeout(resolve, 1000));

        set((state) => ({
            personalDetails: {
                ...state.personalDetails,
                profilePic: photoUrl,
            },
        }));
    },
}));
