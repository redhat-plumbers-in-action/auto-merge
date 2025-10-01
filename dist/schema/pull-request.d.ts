import { z } from 'zod';
export declare const pullRequestApiSchema: z.ZodObject<{
    number: z.ZodNumber;
    title: z.ZodString;
    base: z.ZodPipe<z.ZodObject<{
        ref: z.ZodString;
    }, z.core.$strip>, z.ZodTransform<string, {
        ref: string;
    }>>;
    labels: z.ZodArray<z.ZodPipe<z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>, z.ZodTransform<string, {
        name: string;
    }>>>;
    draft: z.ZodOptional<z.ZodBoolean>;
    merged: z.ZodBoolean;
    mergeable: z.ZodNullable<z.ZodBoolean>;
    mergeable_state: z.ZodString;
}, z.core.$strip>;
export type PullRequestApi = z.infer<typeof pullRequestApiSchema>;
