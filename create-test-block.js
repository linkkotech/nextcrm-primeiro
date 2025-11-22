const { PrismaClient } = require('@prisma/client');

async function createTestBlock() {
    const prisma = new PrismaClient();

    try {
        // Usar o primeiro template existente
        const templateId = 'cmi6q5rim000h12nsvyjmwfu4'; // Pre Campanha

        // Criar um bloco de teste
        const block = await prisma.templateBlock.create({
            data: {
                templateId: templateId,
                type: 'HERO',
                content: {
                    title: 'Bem-vindo',
                    subtitle: 'Este é um bloco de teste',
                    backgroundColor: '#4F46E5'
                },
                sortOrder: 1,
                isActive: true
            }
        });

        console.log('✅ Bloco criado com sucesso!');
        console.log('Block ID:', block.id);
        console.log('Type:', block.type);
        console.log('\nAcesse o editor em:');
        console.log(`http://localhost:3000/pt/admin/editor/${block.id}`);

    } catch (error) {
        console.error('❌ Erro ao criar bloco:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestBlock();
