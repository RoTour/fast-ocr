import type { BaseRepository } from '$lib/interfaces/BaseRepository';
import type { Merchant, Prisma } from '@prisma/client';

export type IMerchantBaseRepository = BaseRepository<Merchant, Prisma.MerchantCreateInput>