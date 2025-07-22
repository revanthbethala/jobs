"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoundSelectionCardProps {
  round: {
    roundNumber: number;
    roundName: string;
    id: string;
    description: string;
  };
  index: number;
  isSelected: boolean;
  onSelect: (roundId: number) => void;
}

export function RoundSelectionCard({
  round,
  index,
  isSelected,
  onSelect,
}: RoundSelectionCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : ""
      }`}
      onClick={() => onSelect(round.roundNumber)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            Round {index + 1}
          </Badge>
          {isSelected && (
            <Badge variant="default" className="text-xs">
              Selected
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-sm mb-1 capitalize">
          {round?.roundName}
        </h3>
        {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          {roundState.eligibleStudents.length} students
        </div> */}
      </CardContent>
    </Card>
  );
}
