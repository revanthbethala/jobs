"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Edit, FileText, Download, Eye } from "lucide-react"
import { motion } from "framer-motion"

// Mock data for demonstration with resume
const mockProfile = {
  personalInfo: {
    username: "john_doe",
    collegeId: "COL123456",
    email: "john.doe@example.com",
    gender: "Male", // This can be "Male", "Female", or "Prefer not to say"
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1999-05-15",
    phoneNumber: "+1234567890",
    address: "123 Main Street, Apartment 4B, Downtown Area",
    fatherName: "Robert Doe",
    motherName: "Jane Doe",
    city: "New York",
    state: "NY",
    country: "USA",
    role: "Student",
  },
  education: [
    {
      id: "1",
      educationalLevel: "B.Tech",
      institution: "Massachusetts Institute of Technology",
      specialization: "CSE",
      boardOrUniversity: "MIT University",
      percentage: "8.5 CGPA",
      passedOutYear: 2023,
      location: "Cambridge, MA",
      noOfActiveBacklogs: 0,
    },
    {
      id: "2",
      educationalLevel: "12th",
      institution: "Central High School",
      specialization: "MPC",
      boardOrUniversity: "State Board of Education",
      percentage: "92%",
      passedOutYear: 2019,
      location: "New York, NY",
      noOfActiveBacklogs: 0,
    },
    {
      id: "3",
      educationalLevel: "10th",
      institution: "Lincoln Middle School",
      specialization: "",
      boardOrUniversity: "State Board of Education",
      percentage: "89%",
      passedOutYear: 2017,
      location: "New York, NY",
      noOfActiveBacklogs: 0,
    },
  ],
  resume: {
    fileName: "John_Doe_Resume.pdf",
    uploadDate: "2024-01-15",
    fileSize: "2.1 MB",
  },
}

interface ProfileDisplayProps {
  onEditProfile?: () => void
}

export function ProfileDisplay({ onEditProfile }: ProfileDisplayProps) {
  const [activeTab, setActiveTab] = useState("personal")

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-brand-blue-dark mb-2">User Profile</h1>
          <p className="text-gray-600">Complete profile overview with education and documents</p>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="mb-8 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-brand-blue-light to-brand-blue-dark h-40 relative">
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <CardContent className="relative pt-0 pb-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-end space-y-6 lg:space-y-0 lg:space-x-8 -mt-20">
                <div className="w-40 h-40 rounded-full bg-white p-3 shadow-xl">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-blue-light to-brand-blue-dark flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="text-center lg:text-left flex-1">
                  <h2 className="text-4xl font-bold text-brand-blue-dark mb-2">
                    {mockProfile.personalInfo.firstName} {mockProfile.personalInfo.lastName}
                  </h2>
                  <p className="text-gray-600 text-xl mb-3">@{mockProfile.personalInfo.username}</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
                    <Badge variant="secondary" className="bg-brand-blue-light text-white px-4 py-2 text-sm">
                      {mockProfile.personalInfo.role}
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 text-sm">
                      {mockProfile.personalInfo.collegeId}
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 text-sm">
                      {mockProfile.education.length} Education{" "}
                      {mockProfile.education.length === 1 ? "Entry" : "Entries"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{mockProfile.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{mockProfile.personalInfo.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {mockProfile.personalInfo.city}, {mockProfile.personalInfo.state}
                      </span>
                    </div>
                  </div>
                </div>
                <Button onClick={handleEditProfile} className="bg-brand-blue-light hover:bg-brand-blue-dark px-6 py-3">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <Button
              variant={activeTab === "personal" ? "default" : "ghost"}
              onClick={() => setActiveTab("personal")}
              className={`px-6 py-3 ${activeTab === "personal" ? "bg-brand-blue-light text-white shadow-md" : "hover:bg-gray-100"}`}
            >
              <User className="w-4 h-4 mr-2" />
              Personal Info
            </Button>
            <Button
              variant={activeTab === "education" ? "default" : "ghost"}
              onClick={() => setActiveTab("education")}
              className={`px-6 py-3 ${activeTab === "education" ? "bg-brand-blue-light text-white shadow-md" : "hover:bg-gray-100"}`}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Education
            </Button>
            <Button
              variant={activeTab === "documents" ? "default" : "ghost"}
              onClick={() => setActiveTab("documents")}
              className={`px-6 py-3 ${activeTab === "documents" ? "bg-brand-blue-light text-white shadow-md" : "hover:bg-gray-100"}`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-brand-blue-light/10 to-brand-blue-dark/10">
                  <CardTitle className="flex items-center space-x-2 text-brand-blue-dark">
                    <Mail className="w-5 h-5 text-brand-blue-light" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-brand-blue-light" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{mockProfile.personalInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-brand-blue-light" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{mockProfile.personalInfo.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-brand-blue-light" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {mockProfile.personalInfo.city}, {mockProfile.personalInfo.state},{" "}
                        {mockProfile.personalInfo.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-brand-blue-light" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {new Date(mockProfile.personalInfo.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Details */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-brand-blue-light/10 to-brand-blue-dark/10">
                  <CardTitle className="flex items-center space-x-2 text-brand-blue-dark">
                    <User className="w-5 h-5 text-brand-blue-light" />
                    <span>Personal Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Gender</p>
                      <p className="font-medium text-lg">{mockProfile.personalInfo.gender}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">College ID</p>
                      <p className="font-medium text-lg">{mockProfile.personalInfo.collegeId}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Full Address</p>
                    <p className="font-medium leading-relaxed">{mockProfile.personalInfo.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Family Information */}
              <Card className="lg:col-span-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-brand-blue-light/10 to-brand-blue-dark/10">
                  <CardTitle className="text-brand-blue-dark">Family Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Father's Name</p>
                      <p className="font-medium text-xl">{mockProfile.personalInfo.fatherName}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Mother's Name</p>
                      <p className="font-medium text-xl">{mockProfile.personalInfo.motherName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Educational Journey</h2>
                <p className="text-gray-600">Complete academic background and achievements</p>
              </div>

              {mockProfile.education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-l-4 border-l-brand-blue-light shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-brand-blue-light/5 to-brand-blue-dark/5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-brand-blue-light rounded-full flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-brand-blue-dark">{edu.educationalLevel}</h3>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                          </div>
                        </CardTitle>
                        <div className="text-right">
                          <Badge variant="outline" className="text-lg px-4 py-2">
                            {edu.passedOutYear}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">Graduated</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Institution</p>
                          <p className="font-medium text-lg">{edu.institution}</p>
                        </div>

                        {edu.specialization && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500 mb-2">Specialization</p>
                            <p className="font-medium text-lg">{edu.specialization}</p>
                          </div>
                        )}

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Board/University</p>
                          <p className="font-medium text-lg">{edu.boardOrUniversity}</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 mb-2">Performance</p>
                          <p className="font-bold text-xl text-green-700">{edu.percentage}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Location</p>
                          <p className="font-medium text-lg">{edu.location}</p>
                        </div>

                        <div
                          className={`p-4 rounded-lg border ${edu.noOfActiveBacklogs === 0 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}
                        >
                          <p
                            className={`text-sm mb-2 ${edu.noOfActiveBacklogs === 0 ? "text-green-600" : "text-orange-600"}`}
                          >
                            Active Backlogs
                          </p>
                          <p
                            className={`font-bold text-xl ${edu.noOfActiveBacklogs === 0 ? "text-green-700" : "text-orange-700"}`}
                          >
                            {edu.noOfActiveBacklogs === 0 ? "No Backlogs" : edu.noOfActiveBacklogs}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Education Summary */}
              <Card className="shadow-lg bg-gradient-to-r from-brand-blue-light/5 to-brand-blue-dark/5">
                <CardHeader>
                  <CardTitle className="text-center text-brand-blue-dark">Education Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4">
                      <p className="text-3xl font-bold text-brand-blue-light">{mockProfile.education.length}</p>
                      <p className="text-gray-600">Total Qualifications</p>
                    </div>
                    <div className="p-4">
                      <p className="text-3xl font-bold text-green-600">
                        {mockProfile.education.filter((edu) => edu.noOfActiveBacklogs === 0).length}
                      </p>
                      <p className="text-gray-600">Clear Records</p>
                    </div>
                    <div className="p-4">
                      <p className="text-3xl font-bold text-brand-blue-dark">
                        {Math.max(...mockProfile.education.map((edu) => edu.passedOutYear))}
                      </p>
                      <p className="text-gray-600">Latest Graduation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Documents & Files</h2>
                <p className="text-gray-600">Uploaded documents and resume</p>
              </div>

              {/* Resume Section */}
              <Card className="shadow-lg mb-8">
                <CardHeader className="bg-gradient-to-r from-brand-blue-light/10 to-brand-blue-dark/10">
                  <CardTitle className="flex items-center space-x-2 text-brand-blue-dark">
                    <FileText className="w-6 h-6 text-brand-blue-light" />
                    <span>Resume</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{mockProfile.resume.fileName}</h3>
                        <p className="text-sm text-gray-500">
                          Uploaded on {new Date(mockProfile.resume.uploadDate).toLocaleDateString()} •{" "}
                          {mockProfile.resume.fileSize}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            PDF Document
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Picture Section */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-brand-blue-light/10 to-brand-blue-dark/10">
                  <CardTitle className="flex items-center space-x-2 text-brand-blue-dark">
                    <User className="w-6 h-6 text-brand-blue-light" />
                    <span>Profile Picture</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-brand-blue-light rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
                        <p className="text-sm text-gray-500">Uploaded on {new Date().toLocaleDateString()} • 1.2 MB</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Image File
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Statistics */}
              <Card className="shadow-lg mt-8 bg-gradient-to-r from-brand-blue-light/5 to-brand-blue-dark/5">
                <CardHeader>
                  <CardTitle className="text-center text-brand-blue-dark">Document Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                    <div className="p-6">
                      <p className="text-4xl font-bold text-brand-blue-light mb-2">2</p>
                      <p className="text-gray-600">Total Documents</p>
                      <p className="text-sm text-gray-500 mt-1">Resume + Profile Picture</p>
                    </div>
                    <div className="p-6">
                      <p className="text-4xl font-bold text-green-600 mb-2">100%</p>
                      <p className="text-gray-600">Profile Complete</p>
                      <p className="text-sm text-gray-500 mt-1">All required documents uploaded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
