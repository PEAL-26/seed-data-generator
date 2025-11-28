import "dotenv/config";

import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL! });

(async () => {
    const [users, posts] = await Promise.all([
        prisma.user.findMany(),
        prisma.post.findMany()
    ]);

    console.log('\n=== USERS ===');
    console.table(users.slice(0, 1));

    console.log('\n=== POSTS ===');
    console.table(posts.slice(0, 1));
})()