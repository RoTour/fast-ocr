import { LineItemSchema } from '@modules/ocr/models/LineItem';
import { z } from 'zod';

export const OwnReceiptListSchema = z.object({
	receipts: z.object({
		id: z.string(),
		lineItems: LineItemSchema.array(),
		merchant: z.object({
			name: z.string(),
			id: z.string(),
			address: z.object({
				street: z.string(),
				city: z.string(),
				country: z.string()
			}).optional()
		}),
		transactionDate: z.string().datetime()
	}).array()
});

export type OwnReceiptList = z.infer<typeof OwnReceiptListSchema>;