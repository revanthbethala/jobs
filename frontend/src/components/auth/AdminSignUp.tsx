import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { signupSchema, SignupFormData } from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { userSignUp } from "@/services/authService";

export const AdminSignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentStep, setEmail, setPassword, setUsername } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setEmail(data.email);
      setUsername(data.username);
      setPassword(data.password);
      setCurrentStep("admin-accessKey");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description:
          error.response.data.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-brand-gray-dark mb-2">
          Admin Registration
        </h2>
        <p className="text-gray-600 text-sm">
          Register to manage your institution's Hive portal
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Admin ID */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="username" className="text-brand-gray-dark">
            Admin ID
          </Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="username"
              type="text"
              placeholder="Enter your Admin ID"
              className="pl-10"
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-600 mt-1">
              {errors.username.message}
            </p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="email" className="text-brand-gray-dark">
            Email Address
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="email"
              type="email"
              placeholder="admin@yourcollege.edu"
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label htmlFor="password" className="text-brand-gray-dark">
            Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a secure password"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Must be atleast 8 characters that includes a uppercase, lowercase,
            and a number.
          </p>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-blue-light hover:bg-brand-blue-dark"
          >
            {isSubmitting ? (
              <span className="flex gap-2 items-center justify-center">
                <Loader2 className="animate-spin" /> Registering...
              </span>
            ) : (
              "Register as Admin"
            )}
          </Button>
        </motion.div>
      </form>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-sm text-gray-600">
          Already have an admin account?{" "}
          <button
            onClick={() => setCurrentStep("admin-login")}
            className="text-brand-blue-light hover:text-brand-blue-dark font-medium"
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
};
export default AdminSignupForm;
