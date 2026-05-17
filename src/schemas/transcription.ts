import { z } from "zod";

export const TranscriptionResponseSchema = z.object({
    transcript: z.string(),
    filename: z.string(),
    duration_seconds: z.number().nonnegative(),
});

// 2. Extract a static TypeScript type from the schema for compile-time safety
export type TranscriptionResponse = z.infer<typeof TranscriptionResponseSchema>;
