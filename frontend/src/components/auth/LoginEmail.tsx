import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LoginEmailFormData, loginEmailSchema } from "@/schemas/authSchema";

export const LoginEmail = () => {
  const { setCurrentStep, setEmail } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginEmailFormData>({
    resolver: zodResolver(loginEmailSchema),
  });

  const onSubmit = async (data: LoginEmailFormData) => {
    try {
      //   const res = await requestLoginOtp(data);
      //   console.log("OTP sent:", res);
      setEmail(data.email);
      toast({
        title: "Login Code Sent!",
        description: "Check your inbox for the login verification code.",
      });
      setCurrentStep("otp");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not send login code. Please try again.",
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
          <LogIn className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-brand-gray-dark mb-2">
          Welcome Back!
        </h2>
        <p className="text-gray-600 text-sm">
          Enter your email address to receive a one-time login code.
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
            {isSubmitting ? "Sending Code..." : "Send Login Code"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};
