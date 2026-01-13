import 'server-only';

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';

declare global {
  var cachedPrisma: PrismaClient;
}
const connectionString = `${process.env.DATABASE_URL}`
let prisma: PrismaClient;
const adapter = new PrismaPg({ connectionString })
if (process.env['NODE_ENV'] === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({ adapter });
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;