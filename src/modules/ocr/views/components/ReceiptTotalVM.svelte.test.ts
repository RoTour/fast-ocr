import type { LineItem } from '@modules/ocr/models/LineItem';
import { DateTime } from 'luxon';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ReceiptTotalVM } from './ReceiptTotalVM.svelte';

describe('Unit:ReceiptTotalVM', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});
	const fakeReceipt = (total: number, date: Date) => ({
		transactionDate: date.toISOString(),
		lineItems: [{ total } as LineItem],
		id: '1',
		merchant: { id: '1', name: 'Test Merchant' }
	});
	test('total should be the sum of every receipt of current month', () => {
		const currentDate = DateTime.fromObject({ year: 2000, month: 1, day: 1 });
		vi.setSystemTime(currentDate.toJSDate());
		// Arrange
		const vm = new ReceiptTotalVM({
			receipts: [
				fakeReceipt(30, currentDate.toJSDate())
			]
		});

		// Act
		// Reactive runes, no action needed

		// Assert
		expect(vm.totalOfCurrentMonth).toBe(30);
	});

	test('Older receipts should not be included in total', () => {
		const currentDate = DateTime.fromObject({ year: 2000, month: 1, day: 1 });
		vi.setSystemTime(currentDate.toJSDate());
		// Arrange
		const vm = new ReceiptTotalVM({
			receipts: [
				fakeReceipt(20, currentDate.minus({ months: 2 }).toJSDate()),
				fakeReceipt(30, currentDate.toJSDate())
			]
		});

		// Act
		// Reactive runes, no action needed

		// Assert
		expect(vm.totalOfCurrentMonth).toBe(30);
	});

});
