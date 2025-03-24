import { AppError } from '$lib/errors/AppError';

export class UserDoesNotExistError extends AppError {
	static userFriendlyMessage = 'We could not find any data related to your account, please try again later.';
	constructor(userId: string) {
		super('UserDoesNotExistError', `User [${userId}] does not exist`, UserDoesNotExistError.userFriendlyMessage, 'error')
	}
}