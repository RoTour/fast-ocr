import type { BaseRepository } from '$lib/interfaces/BaseRepository';
import { Prisma, type User } from '@prisma/client';

export type IUserBaseRepository = BaseRepository<User, Prisma.UserCreateInput>