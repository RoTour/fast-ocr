import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';
import { DateTime } from 'luxon';

export class ReceiptTotalVM {
	private ownReceipts: OwnReceiptList | undefined = $state(undefined);
	public diffSinceLastMonth: number = $derived.by(() => {
		if (!this.ownReceipts) return 0;
		
		const lastMonthReceipts = this.ownReceipts.receipts.filter(receipt => {
			const date = DateTime.fromISO(receipt.transactionDate);
			return date.month === DateTime.now().startOf('month').minus({ months: 1 }).month;
		});

		const lastMonthTotal = lastMonthReceipts.reduce(
			(total, receipt) =>
				total + receipt.lineItems.reduce((lineTotal, lineItem) => lineTotal + lineItem.total, 0),
			0
		);
		return Math.round(lastMonthTotal * 100) / 100;
	});

	public totalOfCurrentMonth = $derived.by(() => {
		if (!this.ownReceipts) return 0;
		const currentMonthReceipts = this.ownReceipts.receipts.filter(receipt => {
			const date = DateTime.fromISO(receipt.transactionDate);
			return date.month === DateTime.now().startOf('month').month;
		});
		const total =  currentMonthReceipts.reduce(
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
