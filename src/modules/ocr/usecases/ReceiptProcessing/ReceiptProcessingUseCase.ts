import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type * as IFileUploadRepository from '@modules/ocr/repositories/IFileUploadRepository';
import type * as IOCRService from '@modules/ocr/services/IOCRService';
import type { IReceiptParser } from '@modules/ocr/usecases/ReceiptProcessing/services/IReceiptParser';
import type { ProcessedReceipt } from './dto/ProcessedReceipt';
import { DateTime } from 'luxon';

type Input = InputFactory<
	{ file: File },
	{
		uploadFile: IFileUploadRepository.UploadFile;
		readDataFromImage: IOCRService.ReadDataFromImage;
		parseReceipt: IReceiptParser['parse'];
	}
>;

type Output = OutputFactory<ProcessedReceipt & { fileUrl: string, dateMightBeWrong: boolean }>;
export type ReceiptProcessingUseCaseOutput = Output;

export const ReceiptProcessingUseCase: UseCase<Input, Output> = ({
	uploadFile,
	readDataFromImage,
	parseReceipt
}) => {
  const detectWrongDate = (date: Date | undefined) => {
    if (!date) return true;
    const dateTime = DateTime.fromJSDate(date);
    if (dateTime > DateTime.now()) return true;
    // if older than last month
    if (dateTime < DateTime.now().minus({ months: 1 })) return true;
    return false;
  };
  return {
    execute: async ({ file }) => {
      try {
        const extension = file.type.split('/')[1];
        const imageUrl = await uploadFile(file, extension);
        const textLines = await readDataFromImage(imageUrl);
        const text = textLines.join('\n');
        const result = await parseReceipt(text);
        const dateMightBeWrong = detectWrongDate(result.transactionDate);
        return UseCaseResponseBuilder.success(200, { ...result, fileUrl: imageUrl, dateMightBeWrong });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to process receipt';
        const status = message.includes('Missing merchant name') ? 422 : 500;
        return UseCaseResponseBuilder.error(status, message);
      }
    }
  }
};
