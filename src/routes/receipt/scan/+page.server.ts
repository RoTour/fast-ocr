import type { ReceiptProcessingUseCaseOutput } from '@modules/ocr/usecases/ReceiptProcessing/ReceiptProcessingUseCase';
import { ReceiptScannerServer } from '@modules/ocr/views/pages/scan/ReceiptScannerServer';
import type { ActionFailure, Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

type FailedAction = { message: string };
type SuccessAction = { results: ReceiptProcessingUseCaseOutput[] };

export const actions: Actions = {
	receipt: async ({ request }): Promise<ActionFailure<FailedAction> | SuccessAction> => {
		const { results, error } = await ReceiptScannerServer().handleReceiptsUploaded(await request.formData());
		if (error) {
			return fail(error.code, { message: error.message });
		}
		return { results };
	}
};
