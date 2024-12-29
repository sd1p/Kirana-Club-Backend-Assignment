import { z } from "zod";

export const jobSubmitSchema = z.object({
  count: z.number(),
  visits: z.array(
    z.object({
      store_id: z.string(),
      image_url: z.array(z.string()), // .url() will be checked in worker.js
      visit_time: z.string(),
    })
  ),
});

export const jobStatusSchema = z.object({
  jobid: z.string(),
});

export type JobSubmitSchemaInput = z.infer<typeof jobSubmitSchema>;
export type JobStatusSchemaInput = z.infer<typeof jobStatusSchema>;
