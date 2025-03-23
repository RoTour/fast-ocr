import { PrismaClient } from '@prisma/client';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { afterAll, beforeAll, beforeEach } from 'vitest';

let postgresContainer: StartedPostgreSqlContainer;
let prisma: PrismaClient;

const resetDb = async () => {
	await prisma.$transaction([
		prisma.address.deleteMany(),
		prisma.lineItem.deleteMany(),
		prisma.receipt.deleteMany(),
		prisma.merchant.deleteMany(),
		prisma.userFile.deleteMany(),
		prisma.user.deleteMany()
	]);
};


beforeAll(async () => {
	postgresContainer = await new PostgreSqlContainer().start();
	console.debug('TestContainers.int.test.ts: beforeAll: Starting database')
	execSync('npx prisma db push', {
		env: { ...process.env, DATABASE_URL: postgresContainer.getConnectionUri() }
	});
	prisma = new PrismaClient({
		datasources: {
			db: {
				url: postgresContainer.getConnectionUri()
			}
		}
	});
}, 30000);

beforeEach(async () => {
	await resetDb();
});

afterAll(async () => {
	await postgresContainer.stop();
	await prisma.$disconnect();
});

export const getPrismaTestClient = () => prisma;