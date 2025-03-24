import { AppErrorConfig, type AppErrorOptions, type LogLevel } from './AppErrorConfig';

export class AppError extends Error {
	private _name: string;
	private _message: string;
	private _userFriendlyMessage: string;
	private _level: LogLevel;

	constructor(
		name: string,
		message: string,
		userFriendlyMessage: string,
		level: LogLevel,
		options?: AppErrorOptions
	) {
		super(message);
		const { logger } = options ?? AppErrorConfig.getConfig();
		this.name = name;
		this._name = name;
		this._level = level;
		this._message = message;
		this._userFriendlyMessage = userFriendlyMessage;
		logger?.(this._name + ': ' + this._message, this._level);
	}

	static createUnexpectedError(error: unknown) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return new AppError(
			'InternalServerError',
			message,
			"An error from our end occurred, we're deeply sorry for the inconvenience. Please try again later.",
			'error'
		);
	}

	get userFriendlyMessage(): string {
		return this._userFriendlyMessage;
	}
}
