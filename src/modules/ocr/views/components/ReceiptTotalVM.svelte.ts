import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';

export class ReceiptTotalVM {
	private ownReceipts: OwnReceiptList | undefined = $state(undefined);

	public total = $derived.by(() => {
		if (!this.ownReceipts) return 0;
		const total =  this.ownReceipts.receipts.reduce(
			(total, receipt) =>
				total + receipt.lineItems.reduce((lineTotal, lineItem) => lineTotal + lineItem.total, 0),
			0
		);
		return Math.round(total * 100) / 100;
	});

	constructor(ownReceipts: OwnReceiptList) {
		this.ownReceipts = ownReceipts;
	}
}
