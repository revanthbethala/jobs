import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { signupSchema, SignupFormData } from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { userSignUp } from "@/services/authService";

export const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentStep, setEmail } = useAuthStore();
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
      const updated_data = {
        ...data,
        username: data.username.toUpperCase(),
        role: "USER",
      };
      const res = await userSignUp(updated_data);
      console.log(res);
      console.log("Signup data:", data);
      toast({
        title: "Account Created!",
        description: "Please verify your email with the OTP we sent.",
      });
      setCurrentStep("otp");
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
    <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-gray-dark mb-2 text-center sm:text-left">
          Create Account
        </h2>
        <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
          Join Hive and start your career journey
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* College ID */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="username" className="text-brand-gray-dark">
            College ID
          </Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="username"
              type="text"
              placeholder="Enter your College ID"
              className="pl-10 border-gray-300 focus:border-brand-blue-light uppercase focus:ring-brand-blue-light text-sm sm:text-base"
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
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
              placeholder="Enter your email"
              className="pl-10 border-gray-300 focus:border-brand-blue-light focus:ring-brand-blue-light text-sm sm:text-base"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.email.message}
            </p>
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
              placeholder="Create a strong password"
              className="pr-10 border-gray-300 focus:border-brand-blue-light focus:ring-brand-blue-light text-sm sm:text-base"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Must be at least 8 characters and contain uppercase, lowercase, and
            a number.
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
            className="w-full bg-brand-blue-light hover:bg-brand-blue-dark transition-colors text-sm sm:text-base"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
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
        <p className="text-xs sm:text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => setCurrentStep("login")}
            className="text-brand-blue-light hover:text-brand-blue-dark font-medium transition-colors"
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
};
export default SignupForm;
