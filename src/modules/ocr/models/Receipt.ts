import { z } from 'zod';
import { LineItemSchema } from './LineItem';
import { ReceiptOwnerSchema } from './ReceiptOwner';
import { MerchantDetailsSchema } from './MerchantDetails';

export const ReceiptSchema = z.object({
	owner: ReceiptOwnerSchema,
	lineItems: LineItemSchema.array().min(1),
	merchant: MerchantDetailsSchema,
	file: z.string().url(),
	transactionDate: z.string().datetime()
});

export type Receipt = z.infer<typeof ReceiptSchema>;