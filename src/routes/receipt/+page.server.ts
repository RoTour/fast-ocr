import { supabaseServer } from '$lib/supabase/supabaseServer';
import { SupabaseFileUploadRepository } from '@modules/ocr/repositories/SupabaseFileUploadRepository';
import { MistralOCRService } from '@modules/ocr/services/MistralOCRService';
import { ReceiptProcessingUseCase } from '@modules/ocr/usecases/receipt/ReceiptProcessingUseCase';
import { OpenrouterReceiptParser } from '@modules/ocr/usecases/receipt/services/OpenrouterReceiptParser';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	receipt: async ({ request }) => {
		const formData = await request.formData();
		const imagesFile = [formData.get('images')].flat() as File[];

		console.debug("ReceiptAction.imagesFile", imagesFile)

		if (!imagesFile) {
			return new Response('No image uploaded', { status: 400 });
		}

		const receiptProcessingUseCase = ReceiptProcessingUseCase({
			readDataFromImage: MistralOCRService().readDataFromImage,
			parseReceipt: OpenrouterReceiptParser('google/gemini-2.0-flash-001').parse,
			uploadFile: SupabaseFileUploadRepository(supabaseServer).uploadFile
		});

		const results = await Promise.all(
			imagesFile.map((file) => receiptProcessingUseCase.execute({ file }))
		);

		return {
			results
		}
	}
};
