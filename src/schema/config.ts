import { z } from 'zod';

export const configLabelsSchema = z.object({
  'dont-merge': z.string().min(1),
  'manual-merge': z.string().min(1),
});
export type ConfigLabels = z.infer<typeof configLabelsSchema>;

export const configSchema = z.object({
  labels: configLabelsSchema,
  'title-prefix': z.array(z.string().min(1)),
  'target-branch': z.array(z.string().min(1)),
});

export type ConfigType = z.infer<typeof configSchema>;
