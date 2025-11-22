const { PrismaClient } = require('@prisma/client');

async function checkBlocks() {
    const prisma = new PrismaClient();

    try {
        // Buscar blocos existentes
        const blocks = await prisma.templateBlock.findMany({
            take: 5,
            select: {
                id: true,
                type: true,
                sortOrder: true,
                template: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        console.log('=== BLOCOS EXISTENTES ===');
        console.log(JSON.stringify(blocks, null, 2));

        if (blocks.length === 0) {
            console.log('\nNenhum bloco encontrado. Vamos verificar templates...\n');

            const templates = await prisma.digitalTemplate.findMany({
                take: 5,
                select: {
                    id: true,
                    name: true,
                    type: true,
                }
            });

            console.log('=== TEMPLATES EXISTENTES ===');
            console.log(JSON.stringify(templates, null, 2));
        }

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkBlocks();
