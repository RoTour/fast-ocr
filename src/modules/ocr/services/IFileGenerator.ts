export type GenerateFile = (data: string[]) => Promise<{
	file: Buffer;
	error: Error | null;
}>