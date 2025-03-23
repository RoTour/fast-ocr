import type { PrismaClient } from '@prisma/client';
import type { IUserBaseRepository } from './IUserBaseRepository';

export type PrismaUserBaseRepository = IUserBaseRepository;

export const PrismaUserBaseRepository = (client: PrismaClient): PrismaUserBaseRepository => {
	return {
		add: async (data) => {
			await client.user.create({ data });
		},
		addAll: async (...data) => {
			await client.$transaction(data.map((d) => client.user.create({ data: d })))
		},
		get: async (id) => {
			return (await client.user.findUnique({ where: { id } })) ?? undefined;
		},
		getAll: async () => {
			return await client.user.findMany();
		},
		update: async (id, data) => {
			await client.user.update({ where: { id }, data });
		},
		delete: async (id) => {
			await client.user.delete({ where: { id } });
		},
		deleteAll: async () => {
			await client.user.deleteMany();
		}
	}
}
