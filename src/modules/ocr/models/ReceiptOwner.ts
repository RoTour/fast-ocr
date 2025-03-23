import { z } from 'zod';

export const ReceiptOwnerSchema = z.object({
	identifier: z.string().min(1)
});

export type ReceiptOwner = z.infer<typeof ReceiptOwnerSchema>;