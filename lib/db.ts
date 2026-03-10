// Prisma DB client singleton
// Requires DATABASE_URL in .env.local

// Uncomment once Prisma is configured:
// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ['query'],
//   });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Stub export for now — replace with prisma instance once DB is provisioned
export const prisma = null as any;

export default prisma;
