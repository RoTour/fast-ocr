import { openrouter } from '$lib/openrouter/client';
import { generateObject } from 'ai';
import { z } from 'zod';
import type { IReceiptParser, ProcessedReceipt } from './IReceiptParser';
import { LineItemSchema, MerchantDetailsSchema } from '../models';

const ReceiptSchema = z.object({
  merchant: MerchantDetailsSchema,
  items: LineItemSchema.array().min(1),
  transactionDate: z.string().datetime().optional()
});

export const OpenrouterReceiptParser = (modelName: string): IReceiptParser => ({
  parse: async (text: string): Promise<ProcessedReceipt> => {
    const model = openrouter(modelName);
    const { object } = await generateObject({
      model,
      prompt: `Extract merchant details, line items, and transaction date from receipt text: ${text}`,
      schema: ReceiptSchema,
      maxRetries: 3
    });
    
    return {
      merchant: object.merchant,
      items: object.items,
      transactionDate: object.transactionDate ? new Date(object.transactionDate) : undefined
    };
  }
});