import { AppErrorConfig, type AppErrorOptions, type LogLevel } from './AppErrorConfig';

export class AppError extends Error {
	name: string;
	message: string;
	userFriendlyMessage: string;
	level: LogLevel;

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
		this.level = level;
		this.message = message;
		this.userFriendlyMessage = userFriendlyMessage;
		logger?.(message, this.level);
	}
}
