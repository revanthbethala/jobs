import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, LoginFormData } from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { userLogin } from "@/services/authService";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentStep, loginToken } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const new_data = { ...data, username: data.username.toUpperCase() };
      const res = await userLogin(new_data);
      toast({
        title: "Login Successful!",
        description: "Welcome back to JobQuest.",
      });
      const role = res?.user?.role;
      const { token } = res;
      const { username, email, id } = res.user;
      loginToken(token, role, email, username, id);
      navigate("/jobs");
    } catch (err) {
      if (err.response.status == 403) {
        toast({
          title: "Login Failed",
          description: "Please verify your account before logging in.",
          variant: "destructive",
        });
        setCurrentStep("login-email");
      }
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-brand-gray-dark mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-sm">
          Sign in to continue your job search
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="email" className="text-brand-gray-dark">
            CollegeId
          </Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="collegeId"
              type="text"
              placeholder="Enter your CollegeId"
              className="pl-10 border-gray-300 uppercase focus:outline-none focus:border-brand-blue-light focus:ring-brand-blue-light"
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="password" className="text-brand-gray-dark">
            Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pr-10 border-gray-300 focus:border-brand-blue-light focus:ring-brand-blue-light"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Close/Show"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <button
            type="button"
            onClick={() => setCurrentStep("forgot-password")}
            className="text-sm text-brand-blue-light hover:text-brand-blue-dark transition-colors"
          >
            Forgot Password?
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-blue-light hover:bg-brand-blue-dark transition-colors"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => setCurrentStep("signup")}
            className="text-brand-blue-light hover:text-brand-blue-dark font-medium transition-colors"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
};
export default LoginForm;
