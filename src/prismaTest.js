const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

async function main() {
    try {
      const user =  await prisma.user.create({data:{
        userId:"user", 
        password:"p",
        phone:'p1',
        name:'n1',
        isAdmin:true}});
        console.log(user);
        await prisma.user.update({where:{
          id:user.id
        },data:{
          userId:'ss'
        }


      });
      console.log(user);
      const user2 = await prisma.user.findOne({where:{id:user.id}});
      console.log(user2);

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




 