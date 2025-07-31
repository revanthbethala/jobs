import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ApplicationAlertsProps {
  showAlert: boolean;
  showConfirmation: boolean;
  isLoading: boolean;
  jobTitle: string;
  companyName: string;
  onCloseAlert: () => void;
  onCloseConfirmation: () => void;
  onGoToProfile: () => void;
  onConfirmApply: () => void;
}

export function ApplicationAlerts({
  showAlert,
  showConfirmation,
  isLoading,
  jobTitle,
  companyName,
  onCloseAlert,
  onCloseConfirmation,
  onGoToProfile,
  onConfirmApply,
}: ApplicationAlertsProps) {
  return (
    <>
      {/* ALERT FOR INCOMPLETE PROFILE */}
      <AlertDialog open={showAlert} onOpenChange={onCloseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex flex-col items-center justify-center">
              <div className="rounded-full border p-5">
                <AlertTriangle size={37} className="text-red-600" />
              </div>
              <span>Profile Incomplete</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your profile is incomplete. Please complete your profile before
              applying for jobs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCloseAlert}>Close</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={onGoToProfile}
            >
              Go to Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={showConfirmation} onOpenChange={onCloseConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {jobTitle}</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply for this position at {companyName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={onConfirmApply}
            >
              {isLoading ? (
                <span className="flex gap-1 items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> Applying
                </span>
              ) : (
                "Apply Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
