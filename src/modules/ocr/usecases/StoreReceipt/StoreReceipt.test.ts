import { describe, expect, test, vi } from 'vitest';
import type { CreatedReceipt } from './dto/CreatedReceipt';
import { StoreReceiptUseCase } from './StoreReceipt';
import { DateTime } from 'luxon';

describe('Unit:StoreReceipt', () => {
	test('should store receipt', async () => {
		// Arrange
		const storeReceipt = vi.fn().mockResolvedValue({});
		const getMerchantId = vi.fn().mockResolvedValue('');
		const usecase = StoreReceiptUseCase({ storeReceipt, getMerchantId });

		// Act
		await usecase.execute({ createdReceipt: {} as CreatedReceipt });

		// Assert
		expect(storeReceipt).toHaveBeenCalled();
	});

	test('stored date should match the provided one', async () => {
		// Arrange
		const receiptDate = DateTime.fromObject({ year: 2000, month: 1, day: 1 });
		let storedDate: Date | undefined;
		const storeReceipt = vi.fn().mockImplementation((data) => {
			storedDate = data.transactionDate;
		});
		const getMerchantId = vi.fn().mockResolvedValue('');
		const usecase = StoreReceiptUseCase({ storeReceipt, getMerchantId });

		// Act
		await usecase.execute({
			createdReceipt: {
				transactionDate: receiptDate.toJSDate()
			} as CreatedReceipt
		});

		// Assert
		expect(storedDate).toEqual(receiptDate.toJSDate().toISOString());
	});

	test('When not transaction date is provided, should use current date', async () => {
		// Arrange
		const currentDate = DateTime.fromObject({ year: 2000, month: 1, day: 1 });
		vi.setSystemTime(currentDate.toJSDate());
		let storedDate: Date | undefined;
		const storeReceipt = vi.fn().mockImplementation((data) => {
			storedDate = data.transactionDate;
		});
		const getMerchantId = vi.fn().mockResolvedValue('');
		const usecase = StoreReceiptUseCase({ storeReceipt, getMerchantId });

		// Act
		await usecase.execute({
			createdReceipt: {
				transactionDate: undefined
			} as CreatedReceipt
		});

		// Assert
		expect(storedDate).toEqual(currentDate.toJSDate().toISOString());
	})
});
