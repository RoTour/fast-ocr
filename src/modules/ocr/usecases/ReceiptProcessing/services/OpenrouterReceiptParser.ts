import { openrouter } from '$lib/openrouter/client';
import { generateObject } from 'ai';
import { z } from 'zod';
import { LineItemSchema } from '../../../models/LineItem';
import { MerchantDetailsSchema } from '../../../models/MerchantDetails';
import type { ProcessedReceipt } from '../dto/ProcessedReceipt';
import type { IReceiptParser } from './IReceiptParser';

const ReceiptSchema = z.object({
	merchant: MerchantDetailsSchema,
	items: LineItemSchema.array().min(1),
	transactionDate: z
		.string()
		.datetime()
		.optional()
		.transform((date) => new Date(date as string))
		.catch(() => new Date())
});

export const OpenrouterReceiptParser = (modelName: string): IReceiptParser => ({
	parse: async (text: string): Promise<ProcessedReceipt> => {
		const model = openrouter(modelName);
		const { object } = await generateObject({
			model,
			prompt: `Extract merchant details, line items, and transaction date from receipt text: ${text}`,
			schema: ReceiptSchema,
			maxRetries: 5
		});

		return {
			merchant: object.merchant,
			items: object.items,
			transactionDate: object.transactionDate ? new Date(object.transactionDate) : undefined
		};
	}
});
