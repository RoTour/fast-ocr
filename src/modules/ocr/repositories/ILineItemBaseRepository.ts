import type { BaseRepository } from '$lib/interfaces/BaseRepository';
import { Prisma, type LineItem } from '@prisma/client';

export type ILineItemBaseRepository = BaseRepository<LineItem, Prisma.LineItemCreateInput>;
