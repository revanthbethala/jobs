import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  Camera,
  Building,
  Award,
  Download,
  CheckCircle2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/profileService";
import { Button } from "../ui/button";

export default function ProfileDisplay() {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profileData"],
    queryFn: getProfile,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const data = userData?.user;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  console.log(data.isCPT);
  const ProfileHeader = () => (
    <div className="bg-brand-blue-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
              {data.profilePic ? (
                <img
                  src={import.meta.env.VITE_BACKEND_URL + data.profilePic}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="uppercase text-4xl font-bold text-brand-blue-dark">
                  {/* {data?.firstName[0]||"J" + data?.lastName[0]||"Q"} */}
                  {data.username[0]}
                </span>
                // <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            {/* <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6" />
            </button> */}
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <h1 className="text-3xl font-bold">
                {data.firstName} {data.lastName}
              </h1>
            </div>
            <p className="text-blue-100 text-lg mb-2">@{data.username}</p>
            <p className="text-blue-100 mb-4">
              Are you in CPT: {data?.isCPT ? "Yes" : "No"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{data.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{data.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {data.city}, {data.state}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {data.resume && (
              <Button className="w-full sm:w-auto bg-white text-brand-gray-dark hover:bg-brand-white/70 ">
                <a
                  href={import.meta.env.VITE_BACKEND_URL + data.resume}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex gap-2 items-center">
                    <Download className="w-4 h-4" />
                    Resume
                  </span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="bg-white border-b overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-4 sm:space-x-8">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "education", label: "Education", icon: GraduationCap },
            { id: "personal", label: "Personal Info", icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Role</span>
              <span className="font-medium capitalize">
                {data.role.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verified</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  data.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {data.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Gender</span>
              <span className="font-medium">{data.gender}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Country</span>
              <span className="font-medium">{data.country}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Education Summary
          </h3>
          {data.education.map((edu) => (
            <div key={edu.id} className="border rounded-lg p-4 mb-4">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {edu.educationalLevel}
                  </h4>
                  <p className="text-gray-600">{edu.specialization}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {edu.percentage}%
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{edu.institution}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{edu.passedOutYear}</span>
                </div>
              </div>
              {edu.noOfActiveBacklogs === 0 && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Award className="w-3 h-3 mr-1" />
                    No Active Backlogs
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EducationTab = () => (
    <div className="space-y-6">
      {data.education.map((edu) => (
        <div key={edu.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {edu.educationalLevel}
              </h3>
              <p className="text-gray-600">{edu.specialization}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Institution
              </label>
              <p className="mt-1 text-gray-900">{edu.institution}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Board/University
              </label>
              <p className="mt-1 text-gray-900">{edu.boardOrUniversity}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Location
              </label>
              <p className="mt-1 text-gray-900">{edu.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Percentage
              </label>
              <p className="mt-1 text-gray-900 font-semibold">
                {edu.percentage}%
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Passed Out Year
              </label>
              <p className="mt-1 text-gray-900">{edu.passedOutYear}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Active Backlogs
              </label>
              <p className="mt-1 text-gray-900">{edu.noOfActiveBacklogs}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const PersonalInfoTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Date of Birth
          </label>
          <p className="mt-1 text-gray-900">{formatDate(data.dateOfBirth)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Phone Number
          </label>
          <p className="mt-1 text-gray-900">{data.phoneNumber}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Father's Name
          </label>
          <p className="mt-1 text-gray-900">{data.fatherName}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Mother's Name
          </label>
          <p className="mt-1 text-gray-900">{data.motherName}</p>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-500">Address</label>
          <p className="mt-1 text-gray-900">{data.address}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">City</label>
          <p className="mt-1 text-gray-900">{data.city}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">State</label>
          <p className="mt-1 text-gray-900">{data.state}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <TabNavigation />
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "education" && <EducationTab />}
        {activeTab === "personal" && <PersonalInfoTab />}
      </div>
    </div>
  );
}
