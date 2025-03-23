import { AppError } from '$lib/errors/AppError';

export class InvalidOwnerError extends AppError {
	constructor(serverMessage: string) {
		super('InvalidOwnerError', serverMessage, 'Invalid owner', 'error');
	}
}
	