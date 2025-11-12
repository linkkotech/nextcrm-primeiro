/**
 * Script para atualizar o adminRole de um usuário específico
 * 
 * Uso: npx tsx scripts/update-user-admin-role.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Atualizando adminRole do usuário...\n");

  // 1. Buscar o AdminRole 'super_admin'
  const superAdminRole = await prisma.adminRole.findUnique({
    where: { name: "super_admin" },
  });

  if (!superAdminRole) {
    console.error("❌ AdminRole 'super_admin' não encontrado!");
    console.log("💡 Execute: npx tsx prisma/seed.ts");
    process.exit(1);
  }

  console.log("✅ AdminRole encontrado:");
  console.log(`   ID: ${superAdminRole.id}`);
  console.log(`   Name: ${superAdminRole.name}\n`);

  // 2. Buscar o usuário por email
  const userEmail = "marcelo@linkko.tech";
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      name: true,
      email: true,
      adminRoleId: true,
      adminRole: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    console.error(`❌ Usuário com email '${userEmail}' não encontrado!`);
    process.exit(1);
  }

  console.log("👤 Usuário encontrado:");
  console.log(`   ID: ${user.id}`);
  console.log(`   Nome: ${user.name}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   AdminRoleId atual: ${user.adminRoleId || "NULL"}`);
  console.log(`   AdminRole atual: ${user.adminRole?.name || "NULL"}\n`);

  // 3. Atualizar o usuário
  if (user.adminRoleId === superAdminRole.id) {
    console.log("ℹ️  Usuário já está associado ao role 'super_admin'");
  } else {
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { adminRoleId: superAdminRole.id },
      select: {
        id: true,
        name: true,
        email: true,
        adminRoleId: true,
        adminRole: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("✅ Usuário atualizado com sucesso!");
    console.log(`   AdminRoleId: ${updatedUser.adminRoleId}`);
    console.log(`   AdminRole: ${updatedUser.adminRole?.name}\n`);
  }

  console.log("🎉 Operação concluída!");
}

main()
  .catch((error) => {
    console.error("❌ Erro durante a execução:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
