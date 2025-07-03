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
      const res = await userSignUp(data);
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
        description: "Something went wrong. Please try again.",
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
          Create Account
        </h2>
        <p className="text-gray-600 text-sm">
          Join JobQuest and start your career journey
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="username" className="text-brand-gray-dark">
            Username
          </Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              className="pl-10 border-gray-300 focus:border-brand-blue-light focus:ring-brand-blue-light"
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
          <Label htmlFor="email" className="text-brand-gray-dark">
            Email Address
          </Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-10 border-gray-300 focus:border-brand-blue-light focus:ring-brand-blue-light"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </motion.div>

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
              className="pr-10 border-gray-300 focus:border-brand-blue-light focus:ring-brand-blue-light"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
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
          <p className="mt-1 text-xs text-gray-500">
            Must contain uppercase, lowercase, and number
          </p>
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
            {isSubmitting ? "Creating Account..." : "Create Account"}
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
