import { getPrismaTestClient } from '$lib/_tests/testContainers.setup.test';
import { PrismaMerchantBaseRepository } from '@modules/ocr/repositories/PrismaMerchantBaseRepository';
import { PrismaReceiptBaseRepository } from '@modules/ocr/repositories/PrismaReceiptBaseRepository';
import { PrismaUserBaseRepository } from '@modules/ocr/repositories/PrismaUserBaseRepository';
import { Prisma, PrismaClient } from '@prisma/client';
import { beforeAll, describe, expect, test } from 'vitest';
import { PrismaStoreReceiptRepository } from './PrismaStoreReceiptRepository';
import { InvalidMerchantError } from '../errors/InvalidMerchantError';
import { InvalidOwnerError } from '../errors/InvalidOwnerError';
import { PrismaLineItemBaseRepository } from '@modules/ocr/repositories/PrismaLineItemBaseRepository';

describe('Int:PrismaStoreReceiptRepository', () => {
	const defaultStore: Prisma.MerchantCreateInput = {
		id: crypto.randomUUID(),
		name: 'TestStore',
		address: {
			create: {
				street: 'TestStreet',
				city: 'TestCity',
				country: 'TestCountry'
			}
		}
	};

	const defaultUser: Prisma.UserCreateInput = {
		id: crypto.randomUUID(),
		email: 'testUser@example.com',
		name: 'Test User'
	};
	let merchantRepository: PrismaMerchantBaseRepository;
	let userRepository: PrismaUserBaseRepository;
	let receiptRepository: PrismaReceiptBaseRepository;
	let lineItemRepository: PrismaLineItemBaseRepository;
	let prisma: PrismaClient;

	beforeAll(() => {
		prisma = getPrismaTestClient();
		merchantRepository = PrismaMerchantBaseRepository(prisma);
		userRepository = PrismaUserBaseRepository(prisma);
		receiptRepository = PrismaReceiptBaseRepository(prisma);
		lineItemRepository = PrismaLineItemBaseRepository(prisma);
	});

	test('Store a receipt', async () => {
		// Arrange
		await userRepository.add(defaultUser);
		await merchantRepository.add(defaultStore);
		const repository = PrismaStoreReceiptRepository(prisma);

		// Act
		await repository.SaveReceipt({
			merchantId: defaultStore.id!,
			file: 'https://example.com',
			lineItems: [],
			transactionDate: new Date().toISOString(),
			owner: {
				identifier: defaultUser.id!
			}
		});
		const savedReceipts = await receiptRepository.getAll();

		// Assert
		expect(savedReceipts).toHaveLength(1);
	});

	test('Should throw error when merchantId is not found', async () => {
		// Arrange
		await userRepository.add(defaultUser);
		await merchantRepository.add(defaultStore);
		const repository = PrismaStoreReceiptRepository(prisma);

		// Act & Assert
		await expect(
			repository.SaveReceipt({
				merchantId: 'nonExistentId',
				file: 'https://example.com',
				lineItems: [],
				transactionDate: new Date().toISOString(),
				owner: {
					identifier: defaultUser.id!
				}
			})
		).rejects.toThrowError(InvalidMerchantError);
	});

	test('Should throw error when owner is not found', async () => {
		// Arrange
		await merchantRepository.add(defaultStore);
		const repository = PrismaStoreReceiptRepository(prisma);

		// Act & Assert
		await expect(
			repository.SaveReceipt({
				merchantId: defaultStore.id!,
				file: 'https://example.com',
				lineItems: [],
				transactionDate: new Date().toISOString(),
				owner: {
					identifier: 'nonExistentId'
				}
			})
		).rejects.toThrowError(InvalidOwnerError);
	});

	test('Should store every line items', async () => {
		await merchantRepository.add(defaultStore);
		await userRepository.add(defaultUser);
		const repository = PrismaStoreReceiptRepository(prisma);

		// Act
		await repository.SaveReceipt({
			merchantId: defaultStore.id!,
			file: 'https://example.com',
			lineItems: [
				{
					description: 'Item 1',
					currency: 'USD',
					quantity: 1,
					unitPrice: 10,
					total: 10
				},
				{
					description: 'Item 2',
					currency: 'USD',
					quantity: 2,
					unitPrice: 5,
					total: 10
				}
			],
			transactionDate: new Date().toISOString(),
			owner: {
				identifier: defaultUser.id!
			}
		});
		const savedLineItems = await lineItemRepository.getAll();

		// Assert
		expect(savedLineItems).toHaveLength(2);
	});
});
