import { Card, CardContent } from "@/components/ui/card";
import { StudentInputSection } from "./StudentInputSection";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobById } from "@/services/jobServices";
import { useEffect } from "react";
import { useJobRoundsStore } from "@/store/jobRoundsStore";
import StudentManagementTable from "./StudentManagementTable";

export default function JobRounds() {
  const { jobId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: () => getJobById(jobId as string),
    enabled: !!jobId,
    retry: false, // prevent retry on backend error
  });

  const { setRounds } = useJobRoundsStore();

  useEffect(() => {
    if (data?.rounds) {
      setRounds(data.rounds);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading job rounds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Error loading job details. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rounds = data?.rounds || [];
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 capitalize">
          Interview Rounds for {data.jobRole} role at {data.companyName}
        </h1>
        <p className="text-muted-foreground">
          {data?.title && `for ${data.title}`}
        </p>
      </div>

      <StudentInputSection />

      {rounds.length > 0 ? (
        <StudentManagementTable />
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              No interview rounds found for this job.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
