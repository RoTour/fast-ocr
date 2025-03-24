import { env } from '$env/dynamic/private';
import { AppError } from '$lib/errors/AppError';
import { EnvNotSetError } from '$lib/errors/common/EnvNotSetError';
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
import { error, fail, type ActionFailure, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ListOwnReceiptsUseCase } from '@modules/ocr/usecases/ListOwnReceipts/ListOwnReceiptsUseCase';
import { PrismaListOwnReceiptsRepository } from '@modules/ocr/usecases/ListOwnReceipts/repositories/PrismaListOwnReceiptsRepository';

export const load: PageServerLoad = async () => {
	const ownReceipts = await ListOwnReceiptsUseCase({
		getUserReceipts: PrismaListOwnReceiptsRepository(prisma).GetUserReceipts
	}).execute({ userId: env.DEFAULT_USER_ID });

	if (!ownReceipts.isSuccess) {
		return error(500, { message: ownReceipts.message });
	}

	return {
		ownReceipts: ownReceipts.data
	};
};

type FailedAction = { message: string };
type SuccessAction = { results: ReceiptProcessingUseCaseOutput[] };

export const actions: Actions = {
	receipt: async ({ request }): Promise<ActionFailure<FailedAction> | SuccessAction> => {
		const formData = await request.formData();
		const imagesFiles = [formData.getAll('images[]')].flat() as File[];

		console.debug('ReceiptAction.imagesFiles', imagesFiles);
		if (!imagesFiles || imagesFiles.filter(Boolean).length === 0) {
			return fail(400, { message: 'No image uploaded' });
		}

		const receiptProcessingUseCase = ReceiptProcessingUseCase({
			readDataFromImage: OpenrouterOCRService('google/gemini-2.0-flash-001').readDataFromImage,
			parseReceipt: OpenrouterReceiptParser('google/gemini-2.0-flash-001').parse,
			uploadFile: SupabaseFileUploadRepository(supabaseServer).uploadFile
		});

		const results = await Promise.all(
			imagesFiles.map((file) => receiptProcessingUseCase.execute({ file }))
		);

		console.debug('ReceiptAction.results', results);

		try {
			await storeSuccesses(results);
		} catch (e) {
			if (e instanceof AppError) return fail(500, { message: e.message });
			return fail(500, { message: 'Failed to store receipt for unknown reason' });
		}

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
