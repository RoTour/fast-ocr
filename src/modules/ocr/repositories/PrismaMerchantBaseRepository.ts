import type { IMerchantBaseRepository } from './IMerchantBaseRepository';
import type { PrismaClient } from '@prisma/client';

export type PrismaMerchantBaseRepository = IMerchantBaseRepository;

export const PrismaMerchantBaseRepository = (
	client: PrismaClient
): PrismaMerchantBaseRepository => {
	return {
		add: async (data) => {
			await client.merchant.create({ data });
		},
		addAll: async (...data) => {
			await client.$transaction(data.map((d) => client.merchant.create({ data: d })));
		},
		get: async (id) => {
			return (await client.merchant.findUnique({ where: { id } })) ?? undefined;
		},
		getAll: async () => {
			return await client.merchant.findMany();
		},
		update: async (id, data) => {
			await client.merchant.update({ where: { id }, data });
		},
		delete: async (id) => {
			await client.merchant.delete({ where: { id } });
		},
		deleteAll: async () => {
			await client.merchant.deleteMany();
		}
	};
};
