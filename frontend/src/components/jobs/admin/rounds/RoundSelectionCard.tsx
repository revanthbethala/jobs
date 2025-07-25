"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useJobRoundsStore } from "@/store/jobRoundsStore";
import { deleteRound } from "@/services/roundServices";
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
  const { selectedRound, rounds } = useJobRoundsStore();
  const handleDeleteRound = async () => {
    const round_info = rounds?.find(
      (round) => round.roundNumber == selectedRound
    );
    const round_id = round_info?.id;
    try {
      const res = await deleteRound(round_id);
      console.log("Delete round", res);
    } catch (err) {
      console.log(err);
    }
  };
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
        {/* <div className="flex mt-2 text-right justify-between flex-row-reverse">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Trash size={16} className="text-red-600 cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteRound}
                  className="bg-red-600 hover:bg-red-600/80"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div> */}
      </CardContent>
    </Card>
  );
}
