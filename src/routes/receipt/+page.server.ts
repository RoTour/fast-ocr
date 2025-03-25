import { env } from '$env/dynamic/private';
import { prisma } from '$lib/prisma/client';
import { ListOwnReceiptsUseCase } from '@modules/ocr/usecases/ListOwnReceipts/ListOwnReceiptsUseCase';
import { PrismaListOwnReceiptsRepository } from '@modules/ocr/usecases/ListOwnReceipts/repositories/PrismaListOwnReceiptsRepository';
import {
	type ReceiptProcessingUseCaseOutput
} from '@modules/ocr/usecases/ReceiptProcessing/ReceiptProcessingUseCase';
import { ReceiptServer } from '@modules/ocr/views/pages/ReceiptServer';
import { error, fail, type ActionFailure, type Actions } from '@sveltejs/kit';
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

type FailedAction = { message: string };
type SuccessAction = { results: ReceiptProcessingUseCaseOutput[] };

export const actions: Actions = {
	receipt: async ({ request }): Promise<ActionFailure<FailedAction> | SuccessAction> => {
		const { results, error } = await ReceiptServer().handleReceiptsUploaded(await request.formData());
		if (error) {
			return fail(error.code, { message: error.message });
		}
		return { results };
	}
};
