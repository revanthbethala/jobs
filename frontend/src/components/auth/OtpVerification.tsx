import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { otpSchema, OtpFormData } from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { email, setCurrentStep, setAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Update form value
    setValue("otp", newOtp.join(""));

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData.split("");
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);
    setValue("otp", pastedData);
  };

  const onSubmit = async (data: OtpFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("OTP verification:", data);

      toast({
        title: "Email Verified!",
        description: "Your account has been successfully verified.",
      });

      setAuthenticated(true);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "OTP Sent!",
        description: "A new verification code has been sent to your email.",
      });

      setTimer(30);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
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
        <button
          onClick={() => setCurrentStep("signup")}
          className="inline-flex items-center text-brand-blue-light hover:text-brand-blue-dark mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue-light rounded-full mb-4">
          <Mail className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-brand-gray-dark mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-sm">We've sent a 6-digit code to</p>
        <p className="text-brand-blue-dark font-medium text-sm">{email}</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center space-x-2"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleOtpChange(index, e.target.value.replace(/\D/, ""))
              }
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-brand-blue-light focus:ring-2 focus:ring-brand-blue-light focus:ring-opacity-20 transition-colors"
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting || otp.join("").length !== 6}
            className="w-full bg-brand-blue-light hover:bg-brand-blue-dark transition-colors"
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>

        {timer > 0 ? (
          <p className="text-sm text-gray-500">Resend in {timer}s</p>
        ) : (
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-sm text-brand-blue-light hover:text-brand-blue-dark font-medium transition-colors"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </motion.div>
    </div>
  );
};
