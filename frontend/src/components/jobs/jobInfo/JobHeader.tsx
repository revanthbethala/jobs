import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface JobHeaderProps {
  onBack: () => void;
}

export function JobHeader({ onBack }: JobHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"
    >
      <div className="container mx-auto px-4 py-4">
        <Button onClick={onBack} variant="ghost" className="hover:bg-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </div>
    </motion.header>
  );
}
