import { ReceiptSchema } from '@modules/ocr/models/Receipt';
import { z } from 'zod';

export const StoreReceiptDataSchema = ReceiptSchema.omit({
	merchant: true
}).extend({
	merchantId: z.string()
});

export type StoreReceiptData = z.infer<typeof StoreReceiptDataSchema>;