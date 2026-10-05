import 'server-only';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var cachedAdapter: PrismaPg | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

function getClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
  }

  if (!global.cachedPrisma) {
    global.cachedAdapter = new PrismaPg({ connectionString });
    global.cachedPrisma = new PrismaClient({ adapter: global.cachedAdapter });
  }
  return global.cachedPrisma;
}

export const db = getClient();