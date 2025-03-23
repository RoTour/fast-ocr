import { Prisma, type PrismaClient } from '@prisma/client';
import * as IStoreReceiptRepository from './IStoreReceiptRepository';
import type { StoreReceiptData } from '../dto/StoreReceiptData';
import { InvalidMerchantError } from '../errors/InvalidMerchantError';
import { InvalidOwnerError } from '../errors/InvalidOwnerError';

type PrismaStoreReceiptRepository = {
	SaveReceipt: IStoreReceiptRepository.SaveReceipt;
};

export const PrismaStoreReceiptRepository = (
	client: PrismaClient
): PrismaStoreReceiptRepository => {
	return {
		SaveReceipt: async (dto: StoreReceiptData) => {
			const { owner, merchantId, transactionDate } = dto;
			try {
				await client.receipt.create({
					data: {
						transactionDate,
						merchantId,
						ownerId: owner.identifier,
						lineItems: {
							createMany: { data: dto.lineItems.map((it) => ({ ...it, total: undefined })) }
						}
					}
				});
			} catch (error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
					const fieldName: string | undefined = error.meta?.field_name as string | undefined;
					if (fieldName?.includes('merchant')) throw new InvalidMerchantError(error.message);
					if (fieldName?.includes('owner')) throw new InvalidOwnerError(error.message);
				}
				throw error;
			}
		}
	};
};
