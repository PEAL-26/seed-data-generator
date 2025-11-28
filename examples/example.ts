import "dotenv/config";

import { PrismaClient } from './generated/prisma/client';
import { faker } from '@faker-js/faker';

import { SeedGenerator } from '../src/seed-generator'

/**
 * Exemplo de uso com Prisma
 */
export async function exampleUsage() {
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL! });

    const seeder = new SeedGenerator({
        orm: 'prisma',
        client: prisma,
        verbose: true,
    });

    await seeder.seed([
        {
            model: 'user',
            count: 50,
            fields: {
                id: { type: 'uuid' },
                email: { type: 'email', unique: true },
                name: { type: 'fullName' },
                password: { type: 'password' },
                age: { type: 'int', min: 18, max: 80 },
                isActive: { type: 'boolean' },
                bio: { type: 'paragraph', optional: true, nullProbability: 0.3 },
                createdAt: { type: 'pastDate' },
            },
            staticData: {
                role: 'USER',
            },
            beforeCreate: (data) => {
                // Hash da senha antes de salvar
                data.password = `hashed_${data.password}`;
                return data;
            },
        },
        {
            model: 'post',
            count: 200,
            fields: {
                id: { type: 'uuid' },
                title: { type: 'sentence' },
                slug: { type: 'slug', unique: true },
                content: { type: 'paragraph' },
                published: { type: 'boolean' },
                views: { type: 'int', min: 0, max: 10000 },
                rating: { type: 'float', min: 0, max: 5, precision: 0.1 },
                status: {
                    type: 'enum',
                    enumValues: ['DRAFT', 'PUBLISHED', 'ARCHIVED']
                },
                tags: {
                    type: 'custom',
                    customFn: () => faker.helpers.arrayElements(
                        ['javascript', 'typescript', 'react', 'node', 'prisma'],
                        { min: 1, max: 3 }
                    ).join(","),
                },
                createdAt: { type: 'pastDate' },
            },
        },
    ]);

    await prisma.$disconnect();
}

// Executa o exemplo se este arquivo for executado diretamente
if (require.main === module) {
    exampleUsage()
        .then(() => console.log('✅ Seeds executados com sucesso!'))
        .catch((error) => {
            console.error('❌ Erro ao executar seeds:', error);
            process.exit(1);
        });
}