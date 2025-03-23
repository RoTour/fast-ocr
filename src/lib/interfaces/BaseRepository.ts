export type BaseRepository<Model, CreateInput> = {
	add: (data: CreateInput) => Promise<void>;
	addAll: (...data: CreateInput[]) => Promise<void>;
	get: (id: keyof Model) => Promise<Model | undefined>;
	getAll: () => Promise<Model[]>;
	update: (id: keyof Model, data: Partial<Model>) => Promise<void>;
	delete: (id: keyof Model) => Promise<void>;
	deleteAll: () => Promise<void>;
}