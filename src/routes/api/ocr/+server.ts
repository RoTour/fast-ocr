import { supabaseServer } from '$lib/supabase/supabaseServer';
import { SupabaseFileUploadRepository } from '@modules/ocr/repositories/SupabaseFileUploadRepository';
import { MistralOCRService } from '@modules/ocr/services/MistralOCRService';
import { GeneratePDFFromImage } from '@modules/ocr/usecases/GenerateDocumentFromImage/GeneratePDFFromImage';
import { MdToMdGenerator } from '@modules/ocr/usecases/GenerateDocumentFromImage/services/MdToMdGenerator';
import { MdToPDFGenerator } from '@modules/ocr/usecases/GenerateDocumentFromImage/services/MdToPDFGenerator';
import { OpenrouterFileNameGenerator } from '@modules/ocr/usecases/GenerateDocumentFromImage/services/OpenrouterFileNameGenerator';
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
