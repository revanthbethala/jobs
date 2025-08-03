import { useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  Download,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { getProfile } from "@/services/profileService";
import { Button } from "../ui/button";
import { format } from "date-fns";
import LoadingSpinner from "../LoadingSpinner";

export default function ProfileDisplay() {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profileData"],
    queryFn: getProfile,
  });
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border max-w-md">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to load profile
          </h2>
          <p className="text-gray-600 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  const data = userData?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
                      {data.firstName || "Not Provided"} {data.lastName || ""}
                    </h1>
                    <p className="text-gray-600 text-base">
                      Roll No: {data.username || "Not Provided"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{data.email || "Not Provided"}</span>
                  </div>
                  {data.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{data.phoneNumber}</span>
                    </div>
                  )}
                  {(data.city || data.state || data.country) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {data.city}
                        {data.state ? `, ${data.state}` : ""}
                        {data.country ? `, ${data.country}` : ""}
                      </span>
                    </div>
                  )}
                  {data.gender && (
                    <div className="flex items-center gap-2">
                      <span>{data.gender}</span>
                    </div>
                  )}
                </div>
              </div>

              {data.resume && (
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  <a
                    href={import.meta.env.VITE_BACKEND_URL + data.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <span>View Resume</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Education Section */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-600" />
                  Education
                </h2>
              </div>
              <div className="p-6">
                {data.education?.length > 0 ? (
                  <div className="space-y-6">
                    {data.education.map((edu, index) => (
                      <div key={edu.id} className="relative">
                        {index > 0 && (
                          <div className="absolute -top-3 left-0 w-full h-px bg-gray-200"></div>
                        )}
                        <div className="pt-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {edu.educationalLevel || "Not Provided"}
                              </h3>
                              <p className="text-gray-700 mb-2">
                                {edu.specialization || "Not Provided"}
                              </p>
                              <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <Building className="w-4 h-4" />
                                <span>{edu.institution || "Not Provided"}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                {edu.percentage || "N/A"}%
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Graduated: {edu.passedOutYear || "Not Provided"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              <span>
                                {edu.boardOrUniversity || "Not Provided"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{edu.location || "Not Provided"}</span>
                            </div>
                            <div>
                              {edu.noOfActiveBacklogs === 0 ||
                              edu.noOfActiveBacklogs === null ? (
                                <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded text-xs">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>No Backlogs</span>
                                </div>
                              ) : (
                                <div className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs">
                                  {edu.noOfActiveBacklogs} Active Backlogs
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No education information available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  Personal Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                      Date of Birth
                    </label>
                    <p className="text-gray-900">
                      {data.dateOfBirth
                        ? format(new Date(data.dateOfBirth), "dd MMM yyyy")
                        : "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                      Father's Name
                    </label>
                    <p className="text-gray-900">
                      {data.fatherName || "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                      Mother's Name
                    </label>
                    <p className="text-gray-900">
                      {data.motherName || "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                      Address
                    </label>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {data.address || "Not Provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                        City
                      </label>
                      <p className="text-gray-900 text-sm">
                        {data.city || "Not Provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                        State
                      </label>
                      <p className="text-gray-900 text-sm">
                        {data.state || "Not Provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
