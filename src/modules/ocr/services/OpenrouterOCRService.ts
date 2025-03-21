import * as IOCRService from './IOCRService';
import { openrouter } from '$lib/openrouter/client';
import { generateText } from 'ai';

type OpenrouterOCRService = {
	readDataFromImage: IOCRService.ReadDataFromImage;
};

export const OpenrouterOCRService = (modelName: string): OpenrouterOCRService => {
	const model = openrouter(modelName);
	return {
		readDataFromImage: async (imageUrl: string) => {
			const result = await generateText({
				model,
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: `You are the best OCR service in the world. Your job is to extract text from the given image. Only output what you see.`
							},
							{ type: 'image', image: new URL(imageUrl) }
						]
					}
				]
			});
			return [result.text];
		}
	};
};
