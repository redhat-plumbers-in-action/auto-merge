import { z } from 'zod';
export declare const configLabelsSchema: z.ZodObject<{
    'dont-merge': z.ZodString;
    'manual-merge': z.ZodString;
}, z.core.$strip>;
export type ConfigLabels = z.infer<typeof configLabelsSchema>;
export declare const configSchema: z.ZodObject<{
    labels: z.ZodObject<{
        'dont-merge': z.ZodString;
        'manual-merge': z.ZodString;
    }, z.core.$strip>;
    'title-prefix': z.ZodArray<z.ZodString>;
    'target-branch': z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type ConfigType = z.infer<typeof configSchema>;
