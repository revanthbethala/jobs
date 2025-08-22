import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { userSignUp } from "@/services/authService";

const accessKeySchema = z.object({
  accessKey: z.string(),
});

type AccessKeyForm = z.infer<typeof accessKeySchema>;

export const AdminAccessKey = () => {
  const { setCurrentStep } = useAuthStore();
  const { toast } = useToast();
  const { username, password, email, userType } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessKeyForm>({
    resolver: zodResolver(accessKeySchema),
  });

  const onSubmit = async (data: AccessKeyForm) => {
    try {
      const updated_data = {
        passkey: data.accessKey,
        username,
        password,
        email,
        role: userType === "superAdmin" ? "SUPER_ADMIN" : "ADMIN",
      };
      const res = await userSignUp(updated_data);
      console.log(res);
      toast({
        title: "Admin Account Created",
        description: "Check your inbox for OTP verification.",
      });
      setCurrentStep("otp");
    } catch (err) {
      toast({
        title: "Invalid Key",
        description:
          err.response.data.message ||
          "The access key you entered is not valid.",
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
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-brand-gray-dark mb-2">
          Admin Access Verification
        </h2>
        <p className="text-gray-600 text-sm">
          Enter your 8-digit admin access key to continue
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            type="text"
            placeholder="Enter Access Key"
            className="text-center tracking-widest font-semibold"
            {...register("accessKey")}
          />
          {errors.accessKey && (
            <p className="text-sm text-red-600 mt-1">
              {errors.accessKey.message}
            </p>
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
            className="w-full bg-brand-blue-light hover:bg-brand-blue-dark"
          >
            {isSubmitting ? "Verifying..." : "Verify Access"}
          </Button>
        </motion.div>
      </form>

      <div className="text-center text-sm  mt-2">
        Back to SignUp?{" "}
        <span
          className="font-medium text-brand-blue-light cursor-pointer"
          onClick={() => setCurrentStep("admin-signup")}
        >
          SignUp
        </span>
      </div>
    </div>
  );
};
export default AdminAccessKey;
