const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    try {
        await prisma.user.create({
            data: {
              name: 'Alice',
              userId:'i1',
              email: 'alice2@prisma.io',
              password:'12',
              phone:'12'
            },
          })
        const allUsers = await prisma.user.findMany()
        console.log(allUsers)
    } catch (error) {
        console.log(error);
    }

}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })