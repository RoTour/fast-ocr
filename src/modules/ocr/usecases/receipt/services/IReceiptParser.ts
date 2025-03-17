import type { MerchantDetails } from '../models/MerchantDetails';
import type { LineItem } from '../models/LineItem';

export interface IReceiptParser {
  parse(text: string): Promise<ProcessedReceipt>;
}

export interface ProcessedReceipt {
  merchant: MerchantDetails;
  items: LineItem[];
  transactionDate?: Date;
}