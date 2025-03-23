import type { PrismaClient } from '@prisma/client';
import type { IReceiptBaseRepository } from './IReceiptBaseRepository';

export type PrismaReceiptBaseRepository = IReceiptBaseRepository;

export const PrismaReceiptBaseRepository = (client: PrismaClient): PrismaReceiptBaseRepository => {
	return {
		add: async (data) => {
			await client.receipt.create({ data });
		},
		addAll: async (...data) => {
			await client.$transaction(data.map(d => client.receipt.create({ data: d })))
		},
		get: async (id) => {
			return await client.receipt.findUnique({ where: { id } }) ?? undefined;
		},
		getAll: async () => {
			return await client.receipt.findMany();
		},
		update: async (id, data) => {
			await client.receipt.update({ where: { id }, data });
		},
		delete: async (id) => {
			await client.receipt.delete({ where: { id } });
		},
		deleteAll: async () => {
			await client.receipt.deleteMany();
		}
	};
};