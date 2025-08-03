import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Shield, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AdminLoginFormData,
  adminLoginSchema,
  LoginFormData,
} from "@/schemas/authSchema";
import { userLogin } from "@/services/authService";
import { useNavigate } from "react-router-dom";

export const AdminLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentStep } = useAuthStore();
  const { toast } = useToast();
  const { loginToken } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });
  const onSubmit = async (data: LoginFormData) => {
    const new_data = { ...data };
    try {
      const res = await userLogin(new_data);
      console.log(res);
      toast({
        title: "Login Successful!",
        description: "Welcome back to JobQuest.",
      });
      const role = res?.user?.role;
      const { token } = res;
      const { username, email, id } = res.user;
      loginToken(token, role, email, username, id);
      navigate("/");
    } catch (err) {
      if (err.response.status == 403) {
        toast({
          title: "Login Failed",
          description: "Please verify your account before logging in.",
          variant: "destructive",
        });
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
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue-dark rounded-full mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-brand-gray-dark mb-2">
          Admin Access
        </h2>
        <p className="text-gray-600 text-sm">
          Sign in to access the admin panel
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="adminId" className="text-brand-gray-dark">
            Admin Id
          </Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="adminId"
              type="text"
              placeholder="Enter your Admin Id"
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full hover:bg-brand-blue-dark bg-brand-blue-light transition-colors"
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
            onClick={() => setCurrentStep("admin-signup")}
            className="text-brand-blue-light hover:text-brand-blue-dark font-medium transition-colors"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
};
export default AdminLoginForm;
