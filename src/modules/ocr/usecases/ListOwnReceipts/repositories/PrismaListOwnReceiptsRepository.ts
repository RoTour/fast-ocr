import type { PrismaClient } from '@prisma/client';
import * as IListOwnReceiptsRepository from './IListOwnReceiptsRepository';
import type { OwnReceiptList } from '../models/OwnReceiptList';
import { UserDoesNotExistError } from '../errors/UserDoesNotExistError';

export type PrismaListOwnReceiptsRepository = {
	GetUserReceipts: IListOwnReceiptsRepository.GetUserReceipts;
};

export const PrismaListOwnReceiptsRepository = (
	client: PrismaClient
): PrismaListOwnReceiptsRepository => {
	return {
		GetUserReceipts: async (userId) => {
			const dataInDb = await client.receipt.findMany({
				where: {
					ownerId: userId
				},
				include: {
					merchant: {
						include: {
							address: true
						}
					},
					lineItems: true
				}
			});
			const receipts: OwnReceiptList['receipts'] = dataInDb.map((receipt) => {
				const address = receipt.merchant.address ? {
					street: receipt.merchant.address.street,
					city: receipt.merchant.address.city,
					country: receipt.merchant.address.country
				} : undefined;
				return {
					id: receipt.id,
					lineItems: receipt.lineItems.map((lineItem) => ({
						...lineItem,
						total: lineItem.quantity * lineItem.unitPrice
					})),
					merchant: {
						id: receipt.merchant.id,
						name: receipt.merchant.name,
						address
					},
					transactionDate: receipt.transactionDate.toISOString()
				}
			});

			// Checking only after to avoid unnecessary calls to database.
			// If receipts are found, then user exists.
			// If no receipts are found, then user might not exist and then we check for user.
			if (receipts.length === 0) {
				const user = await client.user.findUnique({
					where: {
						id: userId
					}
				});
				if (!user) throw new UserDoesNotExistError(userId);
			}
			return { receipts };
		}
	};
};
