
import { mdToPdf } from 'md-to-pdf';
import * as IPDFGenerator from "./IFileGenerator";

type MdToPDFGenerator = {
	generateFile: IPDFGenerator.GenerateFile
};

export const MdToPDFGenerator = (): MdToPDFGenerator => {
	return {
		generateFile: async (data: string[]) => {
			const content = data.join('<div class="page-break"></div>')
			const pdf = await mdToPdf({ content }, { css: "page-break-after: always" });
			return {
				file: Buffer.from(pdf.content),
				error: null
			}
		}
	}
}