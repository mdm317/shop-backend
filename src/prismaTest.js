const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

async function main() {
    try {
      const product = await prisma.product.create({data:{
        price:1, 
        stock:2, 
        description:'d', 
        thumbnail:'t', 
        imageUrl:'u'}});
        await prisma.product.create({data:{
            price:1, 
            stock:2, 
            description:'d', 
            thumbnail:'t', 
            imageUrl:'u'}});
            await prisma.product.create({data:{
                price:1, 
                stock:2, 
                description:'d', 
                thumbnail:'t', 
                imageUrl:'u'}});
        const products = await prisma.product.findOne({
            where:{
                id:product.id
            }
        });
        console.log(products)

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




 