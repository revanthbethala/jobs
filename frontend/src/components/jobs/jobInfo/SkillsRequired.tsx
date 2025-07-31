import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillsRequiredProps {
  skills: string[];
  itemVariants: Variants;
}

export function SkillsRequired({ skills, itemVariants }: SkillsRequiredProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Skills Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill: string, index: number) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge
                  variant="secondary"
                  className="px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
