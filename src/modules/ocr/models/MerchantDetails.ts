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

