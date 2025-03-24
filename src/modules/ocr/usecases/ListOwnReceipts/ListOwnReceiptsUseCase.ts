import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type * as IListOwnReceiptsRepository from './repositories/IListOwnReceiptsRepository';
import type { OwnReceiptList } from './models/OwnReceiptList';
import { UserDoesNotExistError } from './errors/UserDoesNotExistError';
import { AppError } from '$lib/errors/AppError';

type Input = InputFactory<
	{
		userId: string;
	},
	{
		getUserReceipts: IListOwnReceiptsRepository.GetUserReceipts;
	}
>;
type Output = OutputFactory<OwnReceiptList>;

export const ListOwnReceiptsUseCase: UseCase<Input, Output> = ({ getUserReceipts }) => {
	return {
		execute: async ({ userId }) => {
			try {
				const ownReceipts = await getUserReceipts(userId);
				return UseCaseResponseBuilder.success(200, ownReceipts);
			} catch (error) {
				if (error instanceof UserDoesNotExistError) {
					return UseCaseResponseBuilder.error(404, error.userFriendlyMessage);
				}
				const unexpectedError = AppError.createUnexpectedError(error);
				return UseCaseResponseBuilder.error(500, unexpectedError.userFriendlyMessage);
			}
		}
	};
};
