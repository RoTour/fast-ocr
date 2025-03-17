import { UseCaseResponseBuilder, type InputFactory, type OutputFactory, type UseCase } from '$lib/interfaces/UseCase';
import type * as IFileUploadRepository from '@modules/ocr/repositories/IFileUploadRepository';
import type * as IOCRService from '@modules/ocr/services/IOCRService';
import type { IReceiptParser, ProcessedReceipt } from '@modules/ocr/usecases/receipt/services/IReceiptParser';

type Input = InputFactory<
  { file: File },
  { 
    uploadFile: IFileUploadRepository.UploadFile;
    readDataFromImage: IOCRService.ReadDataFromImage; 
    parseReceipt: IReceiptParser['parse']
  }
>;

type Output = OutputFactory<ProcessedReceipt>;

export const ReceiptProcessingUseCase: UseCase<Input,Output> = ({ 
  uploadFile,
  readDataFromImage,
  parseReceipt,
}) => ({
  execute: async ({ file }) => {
    try {
      const extension = file.type.split('/')[1];
      console.debug("ReceiptProcessingUseCase.extension", extension)
      const imageUrl = await uploadFile(file, extension);
      console.debug("ReceiptProcessingUseCase.imageUrl", imageUrl)
      const textLines = await readDataFromImage(imageUrl);
      console.debug("ReceiptProcessingUseCase.textLines", textLines)
      const text = textLines.join('\n');
      console.debug("ReceiptProcessingUseCase.text", text)
      const result = await parseReceipt(text);
      return UseCaseResponseBuilder.success(200, await result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process receipt';
      const status = message.includes('Missing merchant name') ? 422 : 500;
      return UseCaseResponseBuilder.error(status, message);
    }
  }
});