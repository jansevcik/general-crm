const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const email = 'admin@example.com'
    const password = 'password123'

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
            name: 'Admin User',
        },
    })
    console.log({ user })

    const apiKey = await prisma.apiKey.upsert({
        where: { key: 'dev-key-123' },
        update: {},
        create: {
            key: 'dev-key-123',
            name: 'Development Key',
            isActive: true
        }
    })
    console.log({ apiKey })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
