import { openrouter } from '$lib/openrouter/client';
import { generateObject } from 'ai';
import { z } from 'zod';
import * as IFileNameGenerator from './IFileNameGenerator';

type MistralFileNameGenerator = {
	generateFileName: IFileNameGenerator.GenerateFileName;
};

const FilenameSchema = z.object({
	filename: z.string().max(64)
});

export const OpenrouterFileNameGenerator = (): MistralFileNameGenerator => ({
	generateFileName: async (content: string) => {
		const model = openrouter('google/gemini-2.0-flash-001');
		const generatedResponse = await generateObject({
			model,
			prompt: `Generate a filename for the following document content: ${content}`,
			schema: FilenameSchema,
			maxRetries: 3
		});
		console.debug({ filename: generatedResponse.object.filename });
		return generatedResponse.object.filename;
	}
});
