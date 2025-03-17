import { mistral } from '$lib/mistral/client';
import * as IOCRService from './IOCRService';

type MistralOCRService = {
	readDataFromImage: IOCRService.ReadDataFromImage;
};

export const MistralOCRService = (): MistralOCRService => {
	return {
		readDataFromImage: async (imageUrl: string) => {
			const ocrResponse = await mistral.ocr.process({
				model: 'mistral-ocr-latest',
				document: {
					type: 'image_url',
					imageUrl: imageUrl
				}
			});
			console.debug('MistralOCRService.readDataFromImage', ocrResponse.pages);
			return ocrResponse.pages.map((page) => page.markdown);
		}
	};
};
