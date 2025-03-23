import type { LineItem } from '@modules/ocr/models/LineItem';
import type { MerchantDetails } from '@modules/ocr/models/MerchantDetails';

export interface ProcessedReceipt {
  merchant: MerchantDetails;
  items: LineItem[];
  transactionDate?: Date;
}