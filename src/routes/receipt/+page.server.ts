import { AppError } from '$lib/errors/AppError';
import { prisma } from '$lib/prisma/client';
import { supabaseServer } from '$lib/supabase/supabaseServer';
import { SupabaseFileUploadRepository } from '@modules/ocr/repositories/SupabaseFileUploadRepository';
import { OpenrouterOCRService } from '@modules/ocr/services/OpenrouterOCRService';
import {
	ReceiptProcessingUseCase,
	type ReceiptProcessingUseCaseOutput
} from '@modules/ocr/usecases/ReceiptProcessing/ReceiptProcessingUseCase';
import { OpenrouterReceiptParser } from '@modules/ocr/usecases/ReceiptProcessing/services/OpenrouterReceiptParser';
import { InMemoryStoreReceiptRepository } from '@modules/ocr/usecases/StoreReceipt/repositories/InMemoryStoreReceiptRepository';
import { PrismaStoreReceiptRepository } from '@modules/ocr/usecases/StoreReceipt/repositories/PrismaStoreReceiptRepository';
import { StoreReceiptUseCase } from '@modules/ocr/usecases/StoreReceipt/StoreReceipt';
import { fail, type Actions } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { EnvNotSetError } from '$lib/errors/common/EnvNotSetError';

export const actions: Actions = {
	receipt: async ({ request }) => {
		const formData = await request.formData();
		const imagesFile = [formData.get('images')].flat() as File[];

		console.debug('ReceiptAction.imagesFile', imagesFile);

		if (!imagesFile) {
			return fail(400, { message: 'No image uploaded' });
		}

		const receiptProcessingUseCase = ReceiptProcessingUseCase({
			readDataFromImage: OpenrouterOCRService('google/gemini-2.0-flash-001').readDataFromImage,
			parseReceipt: OpenrouterReceiptParser('google/gemini-2.0-flash-001').parse,
			uploadFile: SupabaseFileUploadRepository(supabaseServer).uploadFile
		});

		const results = await Promise.all(
			imagesFile.map((file) => receiptProcessingUseCase.execute({ file }))
		);

		try {
			await storeSuccesses(results);
		} catch (e) {
			if (e instanceof AppError) return fail(500, { message: e.message });
			return fail(500, { message: 'Failed to store receipt for unknown reason' });
		}

		console.debug('ReceiptAction.results', results);

		return {
			results
		};
	}
};

const storeSuccesses = async (results: ReceiptProcessingUseCaseOutput[]) => {
	const storeReceiptUseCase = StoreReceiptUseCase({
		getMerchantId: InMemoryStoreReceiptRepository().GetMerchantId,
		storeReceipt: PrismaStoreReceiptRepository(prisma).SaveReceipt
	});

	const successfulResults = results.filter((it) => it.isSuccess);
	const ownerId = env.DEFAULT_USER_ID;

	if (!ownerId) throw new EnvNotSetError('DEFAULT_USER_ID');

	await Promise.all(
		successfulResults.map(({ data }) =>
			storeReceiptUseCase.execute({
				createdReceipt: {
					fileUrl: data.fileUrl,
					lineItems: data.items,
					merchantName: data.merchant.name,
					owner: {
						identifier: ownerId
					}
				}
			})
		)
	);
};
