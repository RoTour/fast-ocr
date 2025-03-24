import type { OwnReceiptList } from '../models/OwnReceiptList';

export type GetUserReceipts = (userId: string) => Promise<OwnReceiptList>;

export interface IListOwnReceiptsRepository {
	GetUserReceipts: GetUserReceipts;
}
