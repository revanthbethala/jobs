import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { UserTypeToggle } from "@/components/auth/UserTypeToggle";
import { Suspense, lazy } from "react";
import AdminAccessKey from "@/components/auth/AdminAccessKey";

const OtpVerification = lazy(() => import("@/components/auth/OtpVerification"));
const ForgotPassword = lazy(() => import("@/components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/components/auth/ResetPassword"));
const SignupForm = lazy(() => import("@/components/auth/SignupForm"));
const AdminLoginForm = lazy(() => import("@/components/auth/AdminLoginForm"));
const LoginForm = lazy(() => import("@/components/auth/LoginForm"));
const LoginEmail = lazy(() => import("@/components/auth/LoginEmail"));
const AdminSignupForm = lazy(() => import("@/components/auth/AdminSignUp"));

const AuthPage = () => {
  const { userType, currentStep } = useAuthStore();
  const date = new Date();
  const year = date.getFullYear();

  const renderAuthComponent = () => {
    if (currentStep === "signup" && userType === "user") return <SignupForm />;
    if (currentStep === "otp") return <OtpVerification />;
    if (currentStep === "forgot-password") return <ForgotPassword />;
    if (currentStep === "reset-password") return <ResetPassword />;
    if (currentStep === "login-email") return <LoginEmail />;
    if (currentStep === "admin-signup" && userType === "admin")
      return <AdminSignupForm />;
    if (currentStep === "admin-accessKey" && userType === "admin")
      return <AdminAccessKey />;
    if (currentStep === "admin-login") return <AdminLoginForm />;
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
              Hive
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
          © {year} <span className="font-semibold">Hive</span>. All rights
          reserved.
        </motion.div>
      </div>
    </div>
  );
};
export default AuthPage;
