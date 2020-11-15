import prisma from "../src/db";

export async function resetDB() {
  await prisma.image.deleteMany();
  await prisma.qna.deleteMany();
  await prisma.productInOrderCount.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
}
