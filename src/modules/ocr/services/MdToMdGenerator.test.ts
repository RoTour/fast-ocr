import { describe, test, expect  } from 'vitest';
import { MdToMdGenerator } from './MdToMdGenerator';
import { bufferToFile } from '@modules/ocr/usecases/documents/GeneratePDFFromImage';

describe('Encoding from md to md', () => {
	test('should handle accents', async () => {
		const baseMd = "Café"

		const mdGenerated = (await MdToMdGenerator().generateFile([baseMd])).file;
		const mdDecoded = mdGenerated.toString('utf8');

		expect(mdDecoded).toBe(baseMd);
	});

	test('should encode special characters when creating files', async () => {
		const baseMd = "Café"

		const mdGenerated = (await MdToMdGenerator().generateFile([baseMd])).file;
		const file = bufferToFile(mdGenerated, 'result.md', 'text/markdown');

		const mdDecoded = await file.text();

		expect(mdDecoded).toBe(baseMd);
	})
})