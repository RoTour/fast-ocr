import type { ProcessedReceipt } from '../dto/ProcessedReceipt';

export interface IReceiptParser {
  parse(text: string): Promise<ProcessedReceipt>;
}
