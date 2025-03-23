import { UseCaseResponseBuilder, type InputFactory, type OutputFactory, type UseCase } from '$lib/interfaces/UseCase';
import type * as IFileUploadRepository from '@modules/ocr/repositories/IFileUploadRepository';
import type * as IOCRService from '@modules/ocr/services/IOCRService';
import type { IReceiptParser } from '@modules/ocr/usecases/ReceiptProcessing/services/IReceiptParser';
import type { ProcessedReceipt } from './dto/ProcessedReceipt';

type Input = InputFactory<
  { file: File },
  { 
    uploadFile: IFileUploadRepository.UploadFile;
    readDataFromImage: IOCRService.ReadDataFromImage; 
    parseReceipt: IReceiptParser['parse']
  }
>;

type Output = OutputFactory<ProcessedReceipt & { fileUrl: string }>;
export type ReceiptProcessingUseCaseOutput = Output;

export const ReceiptProcessingUseCase: UseCase<Input,Output> = ({ 
  uploadFile,
  readDataFromImage,
  parseReceipt,
}) => ({
  execute: async ({ file }) => {
    try {
      const extension = file.type.split('/')[1];
      const imageUrl = await uploadFile(file, extension);
      const textLines = await readDataFromImage(imageUrl);
      const text = textLines.join('\n');
      const result = await parseReceipt(text);
      return UseCaseResponseBuilder.success(200, { ...result, fileUrl: imageUrl });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process receipt';
      const status = message.includes('Missing merchant name') ? 422 : 500;
      return UseCaseResponseBuilder.error(status, message);
    }
  }
});