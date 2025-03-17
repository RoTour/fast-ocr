import { z } from 'zod';

export const LineItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  total: z.number(),
  currency: z.string()
});

export type LineItem = z.infer<typeof LineItemSchema>;