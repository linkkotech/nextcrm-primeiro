/**
 * Middleware do Prisma para implementar soft deletes.
 * 
 * IMPORTANTE: Este arquivo deve ser importado APENAS em contexto de servidor.
 * Usar 'use server' ou importar apenas em Server Components/Server Actions.
 */

import { PrismaClient } from "@prisma/client";

/**
 * Configura o middleware de soft delete para o cliente Prisma.
 * 
 * Intercepta todas as queries que acessam o modelo User e adiciona
 * automaticamente o filtro where: { deletedAt: null } para as operações
 * de leitura (findUnique, findFirst, findMany).
 * 
 * Dessa forma, usuários "deletados" ficam invisíveis para toda a aplicação,
 * sem necessidade de modificar cada query individualmente.
 * 
 * EDGE CASE: operações create, update, delete, etc. não são filtradas,
 * permitindo que updateMany/deleteMany funcionem normalmente.
 * 
 * @param prisma - Instância do PrismaClient a configurar
 * 
 * @example
 * ```ts
 * const prisma = new PrismaClient();
 * setupSoftDeleteMiddleware(prisma);
 * ```
 */
export function setupSoftDeleteMiddleware(prisma: PrismaClient): void {
  prisma.$use(async (params, next) => {
    // Apenas processar queries do modelo User
    if (params.model === "User") {
      // Para operações de leitura, adicionar filtro de soft delete
      if (["findUnique", "findFirst"].includes(params.action)) {
        // Garantir que where existe
        if (!params.args.where) {
          params.args.where = {};
        }
        // Adicionar condição de soft delete
        params.args.where.deletedAt = null;
      } else if (params.action === "findMany") {
        // Para findMany, adicionar ao array where se existir
        if (!params.args.where) {
          params.args.where = {};
        }
        // Se where já é um objeto, adicionar diretamente
        if (typeof params.args.where === "object" && !Array.isArray(params.args.where)) {
          params.args.where.deletedAt = null;
        }
      }
    }

    return next(params);
  });
}
