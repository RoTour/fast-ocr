import type { StoreReceiptData } from '../dto/StoreReceiptData';

export type SaveReceipt = (receipt: StoreReceiptData) => Promise<void>;
export type GetMerchantId = (merchantName: string) => Promise<string>;
