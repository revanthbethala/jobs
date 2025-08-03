import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Key } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/schemas/authSchema";
import { requestOtp } from "@/services/authService";

export const ForgotPassword = () => {
  const { setCurrentStep, setEmail } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const res = await requestOtp(data);
      console.log("response", res);
      setEmail(data.email);
      toast({
        title: "Reset Code Sent!",
        description: "Check your email for the password reset code.",
      });
      setCurrentStep("reset-password");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to send reset code. Please try again.",
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue-light rounded-full mb-4">
          <Key className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-brand-gray-dark mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-600 text-sm">
          Enter your email address and we'll send you a code to reset your
          password.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
              placeholder="Enter your email address"
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
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-blue-light hover:bg-brand-blue-dark transition-colors"
          >
            {isSubmitting ? "Sending Code..." : "Send Reset Code"}
          </Button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <button
            onClick={() => setCurrentStep("login")}
            className="text-brand-blue-light hover:text-brand-blue-dark font-medium transition-colors"
          >
            Sign In
          </button>
        </p>
        <button
          onClick={() => setCurrentStep("login")}
          className="inline-flex items-center text-base pt-2 text-brand-blue-light hover:text-brand-blue-dark mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </button>
      </motion.div>
    </div>
  );
};
export default ForgotPassword;
