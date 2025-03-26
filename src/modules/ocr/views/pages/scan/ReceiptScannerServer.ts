import { AppError } from '$lib/errors/AppError';
import { EnvNotSetError } from '$lib/errors/common/EnvNotSetError';
import { prisma } from '$lib/prisma/client';
import { supabaseServer } from '$lib/supabase/supabaseServer';
import { SupabaseFileUploadRepository } from '@modules/ocr/repositories/SupabaseFileUploadRepository';
import { OpenrouterOCRService } from '@modules/ocr/services/OpenrouterOCRService';
import { ReceiptProcessingUseCase, type ReceiptProcessingUseCaseOutput } from '@modules/ocr/usecases/ReceiptProcessing/ReceiptProcessingUseCase';
import { OpenrouterReceiptParser } from '@modules/ocr/usecases/ReceiptProcessing/services/OpenrouterReceiptParser';
import { InMemoryStoreReceiptRepository } from '@modules/ocr/usecases/StoreReceipt/repositories/InMemoryStoreReceiptRepository';
import { PrismaStoreReceiptRepository } from '@modules/ocr/usecases/StoreReceipt/repositories/PrismaStoreReceiptRepository';
import { StoreReceiptUseCase } from '@modules/ocr/usecases/StoreReceipt/StoreReceipt';
import { env } from 'process';

type ServerActionResponse = {
	results: ReceiptProcessingUseCaseOutput[];
	error: null
} | {
	results: null;
	error: { code: number; message: string };
};

export const ReceiptScannerServer = () => {
	return {
		handleReceiptsUploaded: async (formData: FormData): Promise<ServerActionResponse> => {
			const imagesFiles = [formData.getAll('images[]')].flat() as File[];
	
			console.debug('ReceiptAction.imagesFiles', imagesFiles);
			if (!imagesFiles || imagesFiles.filter(Boolean).length === 0) {
				return { results: null, error: { code: 400, message: 'No image uploaded' } };
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
				if (e instanceof AppError) return { results: null, error: { code: 500, message: e.userFriendlyMessage } };
				return { results: null, error: { code: 500, message: 'Failed to store receipt for unknown reason' } };
			}
	
			return {
				results,
				error: null
			};
		}
	}
}


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
					},
					transactionDate: data.transactionDate
				}
			})
		)
	);
};
