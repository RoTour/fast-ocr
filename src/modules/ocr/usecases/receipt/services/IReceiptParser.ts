import type { MerchantDetails, LineItem } from '../models';

export interface IReceiptParser {
  parse(text: string): Promise<ProcessedReceipt>;
}

export interface ProcessedReceipt {
  merchant: MerchantDetails;
  items: LineItem[];
  transactionDate?: Date;
}