import { PrismaClient } from "@prisma/client";

/**
 * Singleton pattern para PrismaClient
 * 
 * PROBLEMA em desenvolvimento:
 * - Cada vez que arquivo é modificado, Node.js re-executa módulos
 * - Sem singleton, criaria nova conexão a cada mudança = connection leak
 * 
 * SOLUÇÃO:
 * - Salvar instância em globalThis em desenvolvimento
 * - Em produção, usar nova instância (uma por worker)
 * 
 * Ver: https://www.prisma.io/docs/orm/more/help-center/help-articles/nextjs-prisma-client-dev-practices
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

// Em desenvolvimento, salvar no global para hot-reload reutilizar
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
