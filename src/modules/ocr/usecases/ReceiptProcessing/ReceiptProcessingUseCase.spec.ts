import { UseCaseResponseBuilder } from '$lib/interfaces/UseCase';
import { bufferToFile } from '$lib/utils/file';
import type { UploadFile } from '@modules/ocr/repositories/IFileUploadRepository';
import * as IOCRService from '@modules/ocr/services/IOCRService';
import type { IReceiptParser } from '@modules/ocr/usecases/ReceiptProcessing/services/IReceiptParser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReceiptProcessingUseCase } from './ReceiptProcessingUseCase';
import { DateTime } from 'luxon';

describe('ReceiptProcessingUseCase', () => {
  const mockOCRService = {
    readDataFromImage: vi.fn<IOCRService.ReadDataFromImage>()
  };
  
  const mockUploadFile = vi.fn<UploadFile>();
  const mockReceiptParser = {
    parse: vi.fn<IReceiptParser['parse']>()
  };

  const testFile = bufferToFile(Buffer.from('test'), 'test.jpg', 'image/jpeg');

  beforeEach(() => {
    vi.resetAllMocks();
    mockUploadFile.mockResolvedValue('http://storage/image.jpg');
    mockOCRService.readDataFromImage.mockResolvedValue(['Valid receipt text']);
    mockReceiptParser.parse.mockRejectedValue({
      merchant: { name: 'TestStore' },
      items: [{
        description: 'TestItem',
        quantity: 1,
        unitPrice: 10,
        total: 10,
        currency: 'USD'
      }],
      transactionDate: new Date('2000-01-01T00:00:00.000Z')
    });
  });

  it('should process receipt after successful upload', async () => {
    mockUploadFile.mockResolvedValue('http://storage/image.jpg');
    mockOCRService.readDataFromImage.mockResolvedValue(['Valid receipt text']);
    mockReceiptParser.parse.mockResolvedValue({
      merchant: { name: 'TestStore' },
      items: [{
        description: 'TestItem',
        quantity: 1,
        unitPrice: 10,
        total: 10,
        currency: 'USD'
      }],
      transactionDate: new Date('2000-01-01T00:00:00.000Z')
    });
    const useCase = ReceiptProcessingUseCase({ 
      uploadFile: mockUploadFile,
      readDataFromImage: mockOCRService.readDataFromImage,
      parseReceipt: mockReceiptParser.parse
    });

    const result = await useCase.execute({ file: testFile });

    expect(mockUploadFile).toHaveBeenCalledWith(testFile, 'jpeg');
    expect(mockOCRService.readDataFromImage).toHaveBeenCalledWith('http://storage/image.jpg');
    expect(result).containSubset(UseCaseResponseBuilder.success(200, { 
      merchant: { name: 'TestStore' },
      items: [{
        description: 'TestItem',
        quantity: 1,
        unitPrice: 10,
        total: 10,
        currency: 'USD'
      }],
      transactionDate: new Date('2000-01-01T00:00:00.000Z')
    }));
  });

  it('should handle upload errors', async () => {
    mockUploadFile.mockRejectedValue(new Error('Upload failed'));
    
    const useCase = ReceiptProcessingUseCase({ 
      uploadFile: mockUploadFile,
      readDataFromImage: mockOCRService.readDataFromImage,
      parseReceipt: mockReceiptParser.parse
    });

    const result = await useCase.execute({ file: testFile });
    expect(result).toEqual(UseCaseResponseBuilder.error(500, 'Upload failed'));
  });

  it('should handle OCR errors', async () => {
    mockOCRService.readDataFromImage.mockRejectedValue(new Error('OCR failure'));
    
    const useCase = ReceiptProcessingUseCase({ 
      uploadFile: mockUploadFile,
      readDataFromImage: mockOCRService.readDataFromImage,
      parseReceipt: mockReceiptParser.parse
    });

    const result = await useCase.execute({ file: testFile });
    expect(result).toEqual(UseCaseResponseBuilder.error(500, 'OCR failure'));
  });

  it('should handle parsing errors', async () => {
    mockReceiptParser.parse.mockImplementation(() => {
      throw new Error('Missing merchant name');
    });
    
    const useCase = ReceiptProcessingUseCase({ 
      uploadFile: mockUploadFile,
      readDataFromImage: mockOCRService.readDataFromImage,
      parseReceipt: mockReceiptParser.parse
    });

    const result = await useCase.execute({ file: testFile });
    expect(result).toEqual(UseCaseResponseBuilder.error(422, 'Missing merchant name'));
  });

  it('When parsed date on receipt is after current date, should detect that date is wrong', async () => {
    const currentDate = DateTime.fromObject({ year: 2000, month: 1, day: 1, hour: 0 })
    vi.setSystemTime(currentDate.toJSDate());
    mockReceiptParser.parse.mockResolvedValue({
      merchant: { name: 'TestStore' },
      items: [{
        description: 'TestItem',
        quantity: 1,
        unitPrice: 10,
        total: 10,
        currency: 'USD'
      }],
      transactionDate: currentDate.plus({ days: 1 }).toJSDate()
    });
    const useCase = ReceiptProcessingUseCase({ 
      uploadFile: mockUploadFile,
      readDataFromImage: mockOCRService.readDataFromImage,
      parseReceipt: mockReceiptParser.parse
    });

    const result = await useCase.execute({ file: testFile });
    expect(result).toEqual(UseCaseResponseBuilder.success(200, { 
      merchant: { name: 'TestStore' },
      items: [{
        description: 'TestItem',
        quantity: 1,
        unitPrice: 10,
        total: 10,
        currency: 'USD'
      }],
      transactionDate: currentDate.plus({ days: 1 }).toJSDate(),
      fileUrl: 'http://storage/image.jpg',
      dateMightBeWrong: true
    }));
  })
});