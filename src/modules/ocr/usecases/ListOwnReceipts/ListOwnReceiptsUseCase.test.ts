import { describe, expect, test } from 'vitest';
import { UserDoesNotExistError } from './errors/UserDoesNotExistError';
import type { IListOwnReceiptsRepository } from './repositories/IListOwnReceiptsRepository';
import { ListOwnReceiptsUseCase } from './ListOwnReceiptsUseCase';
import { fail } from 'assert';

describe('Unit:ListOwnReceiptsUseCase', () => {
	test('Should return a failed response when user does not exist', async () => {
		// Arrange
		const repository: IListOwnReceiptsRepository = {
			GetUserReceipts: async () => {
				throw new UserDoesNotExistError('nonExistentId');
			}
		};
		const usecase = ListOwnReceiptsUseCase({ getUserReceipts: repository.GetUserReceipts });

		// Act
		const ucResponse = await usecase.execute({ userId: 'nonExistentId' });

		// Assert
		expect(ucResponse.isSuccess).toBe(false);
		if (ucResponse.isSuccess) fail('Expected a failed response');
		expect(ucResponse.message).toBe(UserDoesNotExistError.userFriendlyMessage);
	});
});
