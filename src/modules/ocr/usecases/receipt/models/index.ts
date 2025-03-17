import { z } from 'zod';

export const MerchantDetailsSchema = z.object({
  name: z.string(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  phone: z.string().optional()
});

export type MerchantDetails = z.infer<typeof MerchantDetailsSchema>;

export const LineItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  total: z.number(),
  currency: z.string()
});

export type LineItem = z.infer<typeof LineItemSchema>;
