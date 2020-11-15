import bcypt from "bcryptjs";
import prisma from "../src/db";
let product1, product2;
async function createUser() {
  const adminpassword = await bcypt.hash(
    "admin",
    Number(process.env.BCRYPTHASH)
  );
  const admin = await prisma.user.create({
    data: {
      userId: "admin",
      password: adminpassword,
      name: "user",
      isAdmin: true,
    },
  }); //create admin user
  const userpassword = await bcypt.hash("user", Number(process.env.BCRYPTHASH));
  const user = await prisma.user.create({
    data: {
      userId: "user",
      password: userpassword,
      name: "user",
      point: 10000,
    },
  }); //create user
  return { user, admin };
}
async function connectProductBetweenImage(product, images) {
  let idx = 0;
  for (const img of images) {
    await prisma.image.create({
      data: {
        url: img,
        product: {
          connect: {
            id: product.id,
          },
        },
        idx,
      },
    });
    idx++;
  }
}
async function createProduct() {
  const name1 = "pro1",
    price1 = 1000,
    stock1 = 5,
    description1 = "it is product 1",
    thumbnail1 = "thumb1",
    pid = "smc3";
  const name2 = "pro2",
    price2 = 10000,
    stock2 = 5,
    description2 = "it is product 2",
    thumbnail2 = "thumb2",
    pid2 = "smc4";
  product1 = await prisma.product.create({
    data: {
      name: name1,
      price: price1,
      stock: stock1,
      description: description1,
      thumbnail: thumbnail1,
      id: pid,
    },
  });
  const product1Image = ["p1url1", "p1url2", "p1url3"];
  product2 = await prisma.product.create({
    data: {
      name: name2,
      price: price2,
      stock: stock2,
      description: description2,
      thumbnail: thumbnail2,
      id: pid2,
    },
  });
  const product2Image = ["p2url1", "p2url2"];
  await connectProductBetweenImage(product1, product1Image);
  await connectProductBetweenImage(product2, product2Image);
  return product1;
}
async function createQuestion(user, product) {
  const qnaContent = "질문입니다.";
  await prisma.qna.create({
    data: {
      id: "q1",
      content: qnaContent,
      user: {
        connect: {
          id: user.id,
        },
      },
      product: {
        connect: {
          id: product.id,
        },
      },
    },
  });
}
export async function addDataInDB() {
  const { user } = await createUser();
  const product = await createProduct();
  await createQuestion(user, product);
}

export const user = { userId: "user", password: "user" };
export const admin = { userId: "admin", password: "admin" };
export const product = { id: "smc3", price: 1000 };
export const productTwo = { id: "smc4", price: 10000 };
export const question = { id: "q1" };
