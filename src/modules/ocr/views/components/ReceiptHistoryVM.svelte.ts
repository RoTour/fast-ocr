import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';

type UIReceipt = {
	merchant: string;
	totalPaid: number;
}

export class ReceiptHistoryVM {
	private ownReceipts: OwnReceiptList | undefined = $state(undefined);

	public receiptList = $derived.by(() => {
		if (!this.ownReceipts) return [];
		return ReceiptHistoryVM.mapReceiptsToUIReceipts(this.ownReceipts.receipts);
	})

	constructor(ownReceipts: OwnReceiptList) {
		this.ownReceipts = ownReceipts;
	}

	private static mapReceiptsToUIReceipts(receipts: OwnReceiptList['receipts']): UIReceipt[] {
		return receipts.map((receipt) => {
			let merchant = receipt.merchant.name;
			if (receipt.merchant.address) merchant += ` (${receipt.merchant.address.city})`;
			return {
				merchant,
				totalPaid: Math.round(receipt.lineItems.reduce((total, item) => total + item.total, 0) * 100) / 100
			};
		});
	}
}