import { z } from "zod";
export const filterSchema = z
  .object({
    search: z.string().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),

    educationFilters: z
      .record(
        z.enum([
          "10th",
          "12th",
          "Diploma",
          "B.Tech",
          "M.Tech",
          "MBA",
          "BCA",
          "MCA",
        ]),
        z.object({
          percentageRange: z
            .tuple([z.number().min(0).max(100), z.number().min(0).max(100)])
            .optional(),
        })
      )
      .optional(),

    passedOutYears: z.array(z.number()).optional(),
    minActiveBacklogs: z.number().optional(),
    maxActiveBacklogs: z.number().optional(),
  })
  .partial();

export type FilterFormData = z.infer<typeof filterSchema>;
