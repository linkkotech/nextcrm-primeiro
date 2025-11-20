const { PrismaClient } = require('@prisma/client');

async function migrateToOrganization() {
  const prisma = new PrismaClient();

  try {
    console.log('🚀 Iniciando migração para Organization...\n');

    // Etapa 1: Criar uma Organization padrão
    console.log('📝 Criando Organization padrão...');
    const defaultOrg = await prisma.$executeRawUnsafe(`
      INSERT INTO "Organization" (id, name, "createdAt", "updatedAt")
      VALUES ('default-org-id', 'Organização Padrão', NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Organization padrão criada!\n');

    // Etapa 2: Adicionar coluna organizationId aos Workspaces existentes
    console.log('📝 Adicionando campo organizationId à tabela Workspace...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Workspace"
      ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
    `);
    
    // Etapa 3: Atualizar workspaces existentes com a organization padrão
    console.log('📝 Associando Workspaces existentes à Organization padrão...');
    await prisma.$executeRawUnsafe(`
      UPDATE "Workspace"
      SET "organizationId" = 'default-org-id'
      WHERE "organizationId" IS NULL;
    `);
    
    // Etapa 4: Tornar o campo obrigatório
    console.log('📝 Tornando organizationId obrigatório...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Workspace"
      ALTER COLUMN "organizationId" SET NOT NULL;
    `);
    
    // Etapa 5: Adicionar foreign key constraint
    console.log('📝 Adicionando constraint de chave estrangeira...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Workspace"
      ADD CONSTRAINT "Workspace_organizationId_fkey"
      FOREIGN KEY ("organizationId")
      REFERENCES "Organization"(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
    
    // Etapa 6: Adicionar índice
    console.log('📝 Adicionando índice em organizationId...');
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Workspace_organizationId_idx"
      ON "Workspace"("organizationId");
    `);

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('📊 Todos os Workspaces foram associados à "Organização Padrão"');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToOrganization();
