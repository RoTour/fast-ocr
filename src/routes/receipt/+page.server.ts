import { env } from '$env/dynamic/private';
import { prisma } from '$lib/prisma/client';
import { ListOwnReceiptsUseCase } from '@modules/ocr/usecases/ListOwnReceipts/ListOwnReceiptsUseCase';
import { PrismaListOwnReceiptsRepository } from '@modules/ocr/usecases/ListOwnReceipts/repositories/PrismaListOwnReceiptsRepository';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const ownReceipts = await ListOwnReceiptsUseCase({
		getUserReceipts: PrismaListOwnReceiptsRepository(prisma).GetUserReceipts
	}).execute({ userId: env.DEFAULT_USER_ID });

	if (!ownReceipts.isSuccess) {
		return error(500, { message: ownReceipts.message });
	}

	return {
		ownReceipts: ownReceipts.data
	};
};
