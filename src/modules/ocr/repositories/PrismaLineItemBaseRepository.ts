import type { PrismaClient } from '@prisma/client';
import type { ILineItemBaseRepository } from './ILineItemBaseRepository';

export type PrismaLineItemBaseRepository = ILineItemBaseRepository;

export const PrismaLineItemBaseRepository = (client: PrismaClient): PrismaLineItemBaseRepository => {
	return {
		add: async (data) => {
			await client.lineItem.create({ data });
		},
		addAll: async (...data) => {
			await client.$transaction(data.map(d => client.lineItem.create({ data: d })))
		},
		get: async (id) => {
			return await client.lineItem.findUnique({ where: { id } }) ?? undefined;
		},
		getAll: async () => {
			return await client.lineItem.findMany();
		},
		update: async (id, data) => {
			await client.lineItem.update({ where: { id }, data });
		},
		delete: async (id) => {
			await client.lineItem.delete({ where: { id } });
		},
		deleteAll: async () => {
			await client.lineItem.deleteMany();
		}
	};
};