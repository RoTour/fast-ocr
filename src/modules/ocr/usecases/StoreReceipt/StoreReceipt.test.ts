import { describe, expect, test, vi } from 'vitest';
import type { CreatedReceipt } from './dto/CreatedReceipt';
import { StoreReceiptUseCase } from './StoreReceipt';

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
});
