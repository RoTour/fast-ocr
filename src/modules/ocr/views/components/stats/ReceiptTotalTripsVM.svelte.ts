import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';

export class ReceiptTotalTripsVM {
	private ownReceipts: OwnReceiptList | undefined = $state(undefined);
	private _totalTrips: number = $derived.by(() => this.calculateTotalTrips());

	constructor(ownReceipts: OwnReceiptList) {
		this.ownReceipts = ownReceipts;
	}

	private calculateTotalTrips(): number {
		if (!this.ownReceipts) return 0;
		return this.ownReceipts.receipts.length;
	}

	get totalTrips() {
		return this._totalTrips;
	}
}
