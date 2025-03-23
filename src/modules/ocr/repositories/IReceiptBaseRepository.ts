import type { BaseRepository } from '$lib/interfaces/BaseRepository';
import { Prisma, type Receipt } from '@prisma/client';

export type IReceiptBaseRepository = BaseRepository<Receipt, Prisma.ReceiptCreateInput>;