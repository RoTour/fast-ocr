import { AppError } from '$lib/errors/AppError';

export class InvalidMerchantError extends AppError {
	constructor(serverMessage: string) {
		super('InvalidMerchantError', serverMessage, 'Invalid merchant', 'error');
	}
}