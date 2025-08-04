import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobDescriptionProps {
  description: string;
  serviceAgreement: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  itemVariants: Variants;
}

export function JobDescription({
  description,
  serviceAgreement,
  isExpanded,
  onToggleExpanded,
  itemVariants,
}: JobDescriptionProps) {
  const shouldShowToggle = description.length > 300;

  return (
    <motion.div variants={itemVariants} className="space-y-3">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <AnimatePresence mode="wait">
              {shouldShowToggle && !isExpanded ? (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-700 leading-relaxed">
                    {description.substring(0, 300)}...
                  </p>
                  <Button
                    variant="ghost"
                    onClick={onToggleExpanded}
                    className="mt-3 text-brand-blue-light hover:text-brand-blue-dark"
                  >
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Read More
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-700 leading-relaxed">{description}</p>
                  {shouldShowToggle && (
                    <Button
                      variant="ghost"
                      onClick={onToggleExpanded}
                      className="mt-3 text-brand-blue-light hover:text-brand-blue-dark"
                    >
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Read Less
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Service Agreement</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-gray-700 leading-relaxed">
                  {serviceAgreement}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
