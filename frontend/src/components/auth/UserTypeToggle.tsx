import { motion } from "framer-motion";
import { useAuthStore, UserType } from "@/store/authStore";

export const UserTypeToggle = () => {
  const { userType, setUserType, setCurrentStep } = useAuthStore();

  const handleToggle = (type: UserType) => {
    setUserType(type);
    if (type === "user") {
      setCurrentStep("login");
    } else if (type === "admin") {
      setCurrentStep("admin-accessKey");
    }
  };

  return (
    <div className="relative bg-slate-200/40 rounded-lg p-1 flex">
      <motion.div
        layout
        className="absolute inset-y-1  bg-brand-blue-light rounded-lg shadow-sm"
        initial={false}
        animate={{
          x: userType === "user" ? 0 : "100%",
          width: "50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        onClick={() => handleToggle("user")}
        className={`relative z-10 flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
          userType === "user"
            ? "text-white"
            : "text-brand-gray-dark hover:text-brand-blue-dark"
        }`}
      >
        User
      </button>

      <button
        onClick={() => handleToggle("admin")}
        className={`relative z-10 flex-1 py-3 px-6 text-sm font-medium rounded-lg transition-colors duration-200 ${
          userType === "admin"
            ? "text-white"
            : "text-brand-gray-dark hover:text-brand-blue-dark"
        }`}
      >
        Admin
      </button>
    </div>
  );
};
export default UserTypeToggle;
