import { AppError } from '../AppError';

export class EnvNotSetError extends AppError {
	constructor(envName: string) {
		super('EnvNotSetError', `Environment variable ${envName} not set`, `An error occurred from our end, please try again later`, 'error');
	}
}