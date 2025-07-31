import { GraduationCap } from "lucide-react";
import { motion, Variant } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EligibilityCriteriaProps {
  allowedBranches: string[];
  allowedPassingYears: string[];
  itemVariants;
}

export function EligibilityCriteria({
  allowedBranches,
  allowedPassingYears,
  itemVariants,
}: EligibilityCriteriaProps) {
  if (allowedBranches.length === 0 && allowedPassingYears.length === 0) {
    return null;
  }

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            Eligibility Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {allowedBranches.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Allowed Branches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allowedBranches.map((branch: string) => (
                    <Badge
                      key={branch}
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1.5 text-sm font-medium"
                    >
                      {branch}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {allowedPassingYears.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Passing Years
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allowedPassingYears.map((year: string) => (
                    <Badge
                      key={year}
                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 px-3 py-1.5 text-sm font-medium"
                    >
                      {year}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

