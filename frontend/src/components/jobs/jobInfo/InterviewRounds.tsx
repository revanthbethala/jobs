import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getUserRoundResults } from "@/services/roundServices";
import { useEffect, useState } from "react";
import { Round } from "@/store/jobRoundsStore";

interface InterviewRoundsProps {
  rounds: Round[];
  itemVariants: any;
}

export function InterviewRounds({
  rounds,
  itemVariants,
}: InterviewRoundsProps) {
  const [isQualified, setIsQualified] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userRoundResults"],
    queryFn: getUserRoundResults,
  });

  useEffect(() => {
    if (data?.rounds && rounds) {
      const allQualified = rounds.every((jobRound) => {
        const userRound = data.rounds.find(
          (r) => r.roundId === jobRound.id
        );
        return userRound?.isQualified === true;
      });
      setIsQualified(allQualified);
    }
  }, [data, rounds]);

  if (!rounds?.length) return null;

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-br from-brand-blue-light to-brand-blue-dark rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            Interview Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-brand-blue-light to-brand-blue-dark opacity-30" />
            <div className="space-y-6">
              {rounds.map((round, index) => {
                const userRound = data?.rounds?.find(
                  (r: UserRound) => r.roundId === round.id
                );
                const isRoundQualified = userRound?.status === "Qualified";

                return (
                  <motion.div
                    key={round.roundNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-4 group"
                  >
                    {/* Round Number Circle */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-gradient-to-br from-brand-blue-light to-brand-blue-dark text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
                      {round.roundNumber}
                    </div>

                    {/* Round Content */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg capitalize">
                          {round.roundName}
                        </h3>

                        {/* Qualification Status */}
                        {userRound && (
                          <span
                            className={`text-sm font-medium px-2 py-1 rounded-full ${
                              isRoundQualified
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isRoundQualified ? "Qualified" : "Not Qualified"}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {round.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
