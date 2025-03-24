import { getPrismaTestClient } from '$lib/_tests/testContainers.setup.test';
import { PrismaLineItemBaseRepository } from '@modules/ocr/repositories/PrismaLineItemBaseRepository';
import { PrismaReceiptBaseRepository } from '@modules/ocr/repositories/PrismaReceiptBaseRepository';
import { PrismaUserBaseRepository } from '@modules/ocr/repositories/PrismaUserBaseRepository';
import { PrismaClient } from '@prisma/client';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { UserDoesNotExistError } from '../errors/UserDoesNotExistError';
import { PrismaListOwnReceiptsRepository } from './PrismaListOwnReceiptsRepository';

describe('Int:PrismaListOwnReceiptsRepository', () => {
	let client: PrismaClient;
	let sut: { repository: PrismaListOwnReceiptsRepository };
	let mocks: {
		receipts: PrismaReceiptBaseRepository;
		lineItems: PrismaLineItemBaseRepository;
		users: PrismaUserBaseRepository;
	};
	beforeAll(async () => {
		client = getPrismaTestClient();
		sut = {
			repository: PrismaListOwnReceiptsRepository(client)
		};
		mocks = {
			receipts: PrismaReceiptBaseRepository(client),
			lineItems: PrismaLineItemBaseRepository(client),
			users: PrismaUserBaseRepository(client)
		};
	});
	const userIds = ['c8626e31-bc3d-49d4-aefb-fbe28f336807', '9d39a71c-b930-4a8d-948c-2e2cfb9d6b7d'];

	beforeEach(() => {
		vi.resetAllMocks();
	});

	test("Should return the user's receipts, not the other users' receipts", async () => {
		// Arrange
		await mocks.users.add({ email: 'test@example.com', name: 'Test', id: userIds[0] });
		await mocks.users.add({ email: 'test2@example.com', name: 'Test2', id: userIds[1] });
		await mocks.receipts.add({
			merchant: { create: { name: 'Test Merchant' } },
			transactionDate: new Date().toISOString(),
			owner: { connect: { id: userIds[0] } },
			lineItems: {
				createMany: {
					data: [
						{ currency: 'USD', description: 'Test Item', quantity: 1, unitPrice: 10 },
						{ currency: 'USD', description: 'Test Item 2', quantity: 2, unitPrice: 5 }
					]
				}
			}
		});
		await mocks.receipts.add({
			merchant: { create: { name: 'Test Merchant 2' } },
			transactionDate: new Date().toISOString(),
			owner: { connect: { id: userIds[1] } },
			lineItems: {
				createMany: {
					data: [
						{ currency: 'USD', description: 'Test Item 3', quantity: 1, unitPrice: 10 },
						{ currency: 'USD', description: 'Test Item 4', quantity: 2, unitPrice: 5 }
					]
				}
			}
		});


		// Act
		const ownReceipts = await sut.repository.GetUserReceipts(userIds[0]);

		// Assert
		expect(ownReceipts.receipts).toHaveLength(1);
		expect(ownReceipts.receipts[0].lineItems).toHaveLength(2);
	});

	test('Totals for each line items should be correct', async () => {
		// Arrange
		await mocks.users.add({ email: 'test@example.com', name: 'Test', id: userIds[0] });
		await mocks.receipts.add({
			merchant: { create: { name: 'Test Merchant' } },
			transactionDate: new Date().toISOString(),
			owner: { connect: { id: userIds[0] } },
			lineItems: {
				createMany: {
					data: [
						{ currency: 'USD', description: 'Test Item', quantity: 1, unitPrice: 3 },
						{ currency: 'USD', description: 'Test Item 2', quantity: 2, unitPrice: 4 }
					]
				}
			}
		});

		// Act
		const ownReceipts = await sut.repository.GetUserReceipts(userIds[0]);

		// Assert
		expect(ownReceipts.receipts[0].lineItems[0].total).toBe(3);
		expect(ownReceipts.receipts[0].lineItems[1].total).toBe(8);
	});

	test('Should throw UserDoesNotExistError when user does not exist', async () => {
		// Act & Assert
		await expect(sut.repository.GetUserReceipts('non-existent-user-id')).rejects.toThrowError(UserDoesNotExistError);
	});
});
