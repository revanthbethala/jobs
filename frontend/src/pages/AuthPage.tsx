import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { OtpVerification } from "@/components/auth/OtpVerification";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { ResetPassword } from "@/components/auth/ResetPassword";
import { SignupForm } from "@/components/auth/SignupForm";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { UserTypeToggle } from "@/components/auth/UserTypeToggle";
import { LoginEmail } from "@/components/auth/LoginEmail";

const AuthPage = () => {
  const { userType, currentStep } = useAuthStore();
  const date = new Date();
  const year = date.getFullYear();

  const renderAuthComponent = () => {
    if (currentStep === "otp") return <OtpVerification />;
    if (currentStep === "forgot-password") return <ForgotPassword />;
    if (currentStep === "reset-password") return <ResetPassword />;
    if (currentStep === "login-email") return <LoginEmail />;
    if (currentStep === "signup" && userType === "user") return <SignupForm />;
    if (userType === "admin") return <AdminLoginForm />;
    return <LoginForm />;
  };

  const hideToggle = ["otp", "forgot-password", "reset-password"].includes(
    currentStep
  );


  return (
    <div className="min-h-screen bg-gray-200/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-white/30"
        >
          {/* Header */}
          <div className="bg-brand-blue-dark px-10 py-6 text-center rounded-t-3xl">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-extrabold text-white"
            >
              JobQuest
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-blue-200 text-sm mt-1"
            >
              Your Career Journey Starts Here
            </motion.p>
          </div>

          {/* Toggle */}
          {!hideToggle && (
            <div className="px-10 pt-6">
              <UserTypeToggle />
            </div>
          )}

          {/* Auth Form */}
          <div className="px-10 pb-10 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${userType}-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {renderAuthComponent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8  text-sm tracking-wide"
        >
          © {year} <span className="font-semibold">JobQuest</span>. All rights
          reserved.
        </motion.div>
      </div>
    </div>
  );
};
export default AuthPage;
