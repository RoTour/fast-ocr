import { supabaseServer } from '$lib/supabase/supabaseServer';
import { SupabaseFileUploadRepository } from '@modules/ocr/repositories/SupabaseFileUploadRepository';
import { MdToMdGenerator } from '@modules/ocr/services/MdToMdGenerator';
import { MdToPDFGenerator } from '@modules/ocr/services/MdToPDFGenerator';
import { MistralOCRService } from '@modules/ocr/services/MistralOCRService';
import { OpenrouterFileNameGenerator } from '@modules/ocr/services/OpenrouterFileNameGenerator';
import { GeneratePDFFromImage } from '@modules/ocr/usecases/documents/GeneratePDFFromImage';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const imageFile = formData.get('image') as File;

	if (!imageFile) {
		return new Response('No image uploaded', { status: 400 });
	}

	try {
		console.debug('Image file', imageFile);
		const outputFilesUrls = await GeneratePDFFromImage({
			uploadFile: SupabaseFileUploadRepository(supabaseServer).uploadFile,
			readDataFromImage: MistralOCRService().readDataFromImage,
			generatePDF: MdToPDFGenerator().generateFile,
			generateMD: MdToMdGenerator().generateFile,
			generateFileName: OpenrouterFileNameGenerator().generateFileName
		}).execute({ file: imageFile, exportTypes: ['md'] });

		return json({ outputFilesUrls });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to process image' },
			{ status: 500 }
		);
	}
};
