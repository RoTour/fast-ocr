import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { CreatedReceipt } from './dto/CreatedReceipt';
import * as IStoreReceiptRepository from './repositories/IStoreReceiptRepository';

type Input = InputFactory<
	{
		createdReceipt: CreatedReceipt;
	},
	{
		getMerchantId: IStoreReceiptRepository.GetMerchantId;
		storeReceipt: IStoreReceiptRepository.SaveReceipt;
	}
>;

type Output = OutputFactory<{
	success: boolean;
}>;

export const StoreReceiptUseCase: UseCase<Input, Output> = ({ storeReceipt, getMerchantId }) => ({
	execute: async ({ createdReceipt }) => {
		const merchantId = await getMerchantId(createdReceipt.merchantName);
		const transactionDate = new Date().toISOString();
		const file = createdReceipt.fileUrl;

		await storeReceipt({
			...createdReceipt,
			merchantId,
			transactionDate,
			file
		});

		return UseCaseResponseBuilder.success(200, { success: true });
	}
});
