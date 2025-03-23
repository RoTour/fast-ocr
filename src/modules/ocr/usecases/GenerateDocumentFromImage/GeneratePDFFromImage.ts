import * as IFileUploadRepository from '../../repositories/IFileUploadRepository';
import * as IOCRService from '../../services/IOCRService';
import * as IFileGenerator from './services/IFileGenerator';
import * as IFileNameGenerator from './services/IFileNameGenerator';

type Deps = {
	uploadFile: IFileUploadRepository.UploadFile;
	readDataFromImage: IOCRService.ReadDataFromImage;
	generatePDF: IFileGenerator.GenerateFile;
	generateMD: IFileGenerator.GenerateFile;
	generateFileName: IFileNameGenerator.GenerateFileName;
};

type Args = {
	file: File;
	exportTypes: ('md' | 'pdf')[];
};

export const GeneratePDFFromImage = ({
	uploadFile,
	readDataFromImage,
	generatePDF,
	generateMD,
	generateFileName
}: Deps) => {
	return {
		execute: async ({ file, exportTypes }: Args) => {
			console.debug('uploading image');
			let imageUrl: string | null = null;
			try {
				imageUrl = await uploadFile(file, file.type.split('/')[1]);
			} catch (error) {
				console.error('Failed to upload image', error);
				throw error;
			}
			
			const downloadUrlsPromises = exportTypes.map(async (type) => {
				console.debug('reading data from image');
				let data: string[] = [];
				try {
					data = await readDataFromImage(imageUrl);
				} catch (error) {
					console.error('Failed to read data from image', error);
					throw error;
				}
				const fileName = await generateFileName(data.join('\n'));
				console.debug("Read data:", data)
				if (type === 'pdf') {
					console.debug('generating pdf');
					let pdfUrl: Buffer | null = null;
					try {
						pdfUrl = (await generatePDF(data)).file;
					} catch (error) {
						console.error('Failed to generate PDF', error);
						throw error;
					}
					console.debug(`uploading ${type}`);
					return uploadFile(bufferToFile(pdfUrl, `${fileName}.${type}`, 'application/pdf'), 'pdf');
				}
				const mdFile = (await generateMD(data)).file;
				return uploadFile(bufferToFile(mdFile, `${fileName}.${type}`, 'text/markdown'), 'md');
			});

			const downloadUrls = await Promise.all(downloadUrlsPromises);
			return downloadUrls;
		}
	};
};

// Alternative approach focusing on character decoding/re-encoding
export const bufferToFile = (buffer: Buffer, filename: string, mimeType: string): File => {
  // First decode the buffer to string with proper charset
  const content = buffer.toString('utf8');
  
  // Create a proper UTF-8 encoded Blob
  const blob = new Blob([content], { type: mimeType });
  
  // Create a File from the Blob
  return new File([blob], filename, { type: mimeType });
};