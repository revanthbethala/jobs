import { useState } from "react";

import { Button } from "@/components/ui/button";
import { User, FileText } from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileDisplay from "@/components/profile/ProfileDisplay";

export default function Home() {
  const [currentView, setCurrentView] = useState<"form" | "profile">("form");

  const handleEditProfile = () => {
    setCurrentView("profile");
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-blue-light rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-brand-blue-dark">
                ProfileBuilder
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={currentView === "form" ? "default" : "outline"}
                onClick={() => setCurrentView("form")}
                className={currentView === "form" ? "bg-brand-blue-light" : ""}
              >
                <FileText className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
              <Button
                variant={currentView === "profile" ? "default" : "outline"}
                onClick={() => setCurrentView("profile")}
                className={
                  currentView === "profile" ? "bg-brand-blue-light" : ""
                }
              >
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {currentView === "form" ? (
        <ProfileForm />
      ) : (
        <ProfileDisplay onEditProfile={handleEditProfile} />
      )}
    </div>
  );
}
