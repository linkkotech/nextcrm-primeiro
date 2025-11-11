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

/**
 * Provides a singleton Prisma client so hot reloads do not exhaust database connections.
 *
 * @example
 * ```ts
 * const users = await prisma.user.findMany({ where: { workspaceId } })
 * ```
 *
 * @throws {Error} When Prisma cannot establish a connection using the current environment variables.
 * @returns {PrismaClient} A shared Prisma client instance reused across module reloads in development.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

// Em desenvolvimento, salvar no global para hot-reload reutilizar
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
