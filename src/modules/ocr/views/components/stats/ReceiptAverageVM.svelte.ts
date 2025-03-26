import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';

export class ReceiptAverageVM {
	private ownReceipts: OwnReceiptList | undefined = $state(undefined);
	private _average: number = $derived.by(() => this.calculateAverage());
	
  constructor(ownReceipts: OwnReceiptList) {
		this.ownReceipts = ownReceipts;
	}

	private calculateAverage(): number {
		if (!this.ownReceipts) return 0;
		const total =  this.ownReceipts.receipts.reduce(
			(total, receipt) =>
				total + receipt.lineItems.reduce((lineTotal, lineItem) => lineTotal + lineItem.total, 0),
			0
		);
		return Math.round(total * 100) / 100;
	}

	get average() {
		return this._average;
	}
}