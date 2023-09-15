import { z } from 'zod';
export declare const pullRequestApiSchema: z.ZodObject<{
    number: z.ZodNumber;
    title: z.ZodString;
    base: z.ZodEffects<z.ZodObject<{
        ref: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        ref: string;
    }, {
        ref: string;
    }>, string, {
        ref: string;
    }>;
    labels: z.ZodArray<z.ZodEffects<z.ZodObject<{
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
    }, {
        name: string;
    }>, string, {
        name: string;
    }>, "many">;
    draft: z.ZodBoolean;
    merged: z.ZodBoolean;
    mergeable_state: z.ZodString;
}, "strip", z.ZodTypeAny, {
    number: number;
    base: string;
    labels: string[];
    title: string;
    draft: boolean;
    merged: boolean;
    mergeable_state: string;
}, {
    number: number;
    base: {
        ref: string;
    };
    labels: {
        name: string;
    }[];
    title: string;
    draft: boolean;
    merged: boolean;
    mergeable_state: string;
}>;
export type PullRequestApi = z.infer<typeof pullRequestApiSchema>;
