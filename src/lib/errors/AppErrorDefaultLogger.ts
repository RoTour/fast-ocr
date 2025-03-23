import type { LogLevel } from './AppErrorConfig';

export const AppErrorDefaultLogger = (message: string, level: LogLevel) => {
	if (level === 'error') return console.error("AppError: 	" + message);
	if (level === 'warn') return console.warn("AppError: 	" + message);
	if (level === 'debug') return console.debug("AppError: 	" + message);
}