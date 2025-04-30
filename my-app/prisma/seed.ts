import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){
    await prisma.user.create({
        data: {
            email: 'test1@example.com',
            password: '$2b$10$2C6ACz007AVKb.pb5fW2qONHzg87tA0rWJmdMsa2Sj8F1rqdzbWO.',
            name: 'テストユーザー1',
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    }
    )
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
    );