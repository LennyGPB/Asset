import { PrismaClient } from "@prisma/client";

declare global {
  // Permet à TypeScript de comprendre que `global` peut avoir une propriété `prisma`
  var prisma: PrismaClient | undefined;
}

// Utilise une instance Prisma stockée globalement en développement pour éviter les connexions multiples
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
