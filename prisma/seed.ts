import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Seed AdminRoles
    console.log("📝 Inserindo AdminRoles...");
    await prisma.adminRole.createMany({
      data: [
        { name: "super_admin" },
        { name: "admin" },
        { name: "manager" },
      ],
      skipDuplicates: true,
    });
    console.log("✅ AdminRoles inseridas com sucesso!");

    // Seed WorkspaceRoles
    console.log("📝 Inserindo WorkspaceRoles...");
    await prisma.workspaceRole.createMany({
      data: [
        { name: "work_admin" },
        { name: "work_manager" },
        { name: "work_user" },
      ],
      skipDuplicates: true,
    });
    console.log("✅ WorkspaceRoles inseridas com sucesso!");

    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
