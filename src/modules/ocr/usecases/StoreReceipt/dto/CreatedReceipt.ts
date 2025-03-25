import { LineItemSchema } from '@modules/ocr/models/LineItem';
import { z } from 'zod';

export const CreatedReceiptSchema = z.object({
	lineItems: LineItemSchema.array(),
	merchantName: z.string(),
	owner: z.object({
		identifier: z.string()
	}),
	transactionDate: z.date().optional(),
	fileUrl: z.string(),
})

export type CreatedReceipt = z.infer<typeof CreatedReceiptSchema>;