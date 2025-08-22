import { motion } from "framer-motion";
import { useAuthStore, UserType } from "@/store/authStore";

export const UserTypeToggle = () => {
  const { userType, setUserType, currentStep, setCurrentStep } = useAuthStore();
  const handleToggle = (type: UserType) => {
    setUserType(type);
    if (type === "user") {
      setCurrentStep("signup");
    } else if (type === "admin" || type === "superAdmin") {
      setCurrentStep("admin-login");
    }
  };
  console.log(currentStep, userType);
  // mapping userType → index
  const typeIndex = userType === "user" ? 0 : userType === "admin" ? 1 : 2;

  return (
    <div className="relative bg-slate-200/40 rounded-lg p-1 flex overflow-hidden w-full max-w-md mx-auto">
      {/* Highlight Background */}
      <motion.div
        layout
        className="absolute top-1 bottom-1 bg-brand-blue-light rounded-lg shadow-sm"
        initial={false}
        animate={{
          x: `${typeIndex * 100}%`, // move highlight
          width: "33.3333%", // one-third of container
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* User */}
      <button
        onClick={() => handleToggle("user")}
        className={`relative z-10 flex-1 py-2 sm:py-3 px-2 sm:px-4
          text-xs sm:text-sm md:text-base font-medium rounded-lg transition-colors duration-200
          ${
            userType === "user"
              ? "text-white"
              : "text-brand-gray-dark hover:text-brand-blue-dark"
          }`}
      >
        User
      </button>

      {/* Admin */}
      <button
        onClick={() => handleToggle("admin")}
        className={`relative z-10 flex-1 py-2 sm:py-3 px-2 sm:px-4 
          text-xs sm:text-sm md:text-base font-medium rounded-lg transition-colors duration-200
          ${
            userType === "admin"
              ? "text-white"
              : "text-brand-gray-dark hover:text-brand-blue-dark"
          }`}
      >
        Admin
      </button>

      {/* Super Admin */}
      <button
        onClick={() => handleToggle("superAdmin")}
        className={`relative z-10 flex-1 py-2 sm:py-3 px-2 sm:px-4 
          text-xs sm:text-sm md:text-base font-medium rounded-lg transition-colors duration-200
          ${
            userType === "superAdmin"
              ? "text-white"
              : "text-brand-gray-dark hover:text-brand-blue-dark"
          }`}
      >
        Super Admin
      </button>
    </div>
  );
};

export default UserTypeToggle;
