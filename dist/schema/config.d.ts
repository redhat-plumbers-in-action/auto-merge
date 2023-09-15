import { z } from 'zod';
export declare const configLabelsSchema: z.ZodObject<{
    'dont-merge': z.ZodString;
    'manual-merge': z.ZodString;
}, "strip", z.ZodTypeAny, {
    'dont-merge': string;
    'manual-merge': string;
}, {
    'dont-merge': string;
    'manual-merge': string;
}>;
export type ConfigLabels = z.infer<typeof configLabelsSchema>;
export declare const configSchema: z.ZodObject<{
    labels: z.ZodObject<{
        'dont-merge': z.ZodString;
        'manual-merge': z.ZodString;
    }, "strip", z.ZodTypeAny, {
        'dont-merge': string;
        'manual-merge': string;
    }, {
        'dont-merge': string;
        'manual-merge': string;
    }>;
    'title-prefix': z.ZodArray<z.ZodString, "many">;
    'target-branch': z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    labels: {
        'dont-merge': string;
        'manual-merge': string;
    };
    'title-prefix': string[];
    'target-branch': string[];
}, {
    labels: {
        'dont-merge': string;
        'manual-merge': string;
    };
    'title-prefix': string[];
    'target-branch': string[];
}>;
export type ConfigType = z.infer<typeof configSchema>;
