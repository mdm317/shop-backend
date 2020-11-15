import prisma from "../db";

let orderCount = 0;
const checkEnoughStock = async (productIdAndCount) => {
  let cashCheck = 0;
  let enoughStock = true;
  const newStock = [];

  for (const idAndCount of productIdAndCount) {
    const product = await prisma.product.findOne({
      where: {
        id: idAndCount.id,
      },
    });
    cashCheck += idAndCount.count * product.price;
    if (product.stock < idAndCount.count) {
      enoughStock = false;
    } else {
      newStock.push(product.stock - idAndCount.count);
    }
  }
  if (!enoughStock) {
    return { newStock: [], cashCheck };
  }

  return { newStock, cashCheck };
};
export const addOrderController = async (req, res) => {
  const {
    productIdAndCount,
    address1,
    address2,
    zipcode,
    cash,
    name,
    message,
    phone,
  } = req.body;

  const remainCash = req.user.point - cash;
  if (remainCash < 0) {
    return res.status(403).send("you need to recharge point");
  }

  const { newStock, cashCheck } = await checkEnoughStock(productIdAndCount);
  //재고와 금액이 맞는지 확인한다.

  if (newStock.length === 0) {
    return res.status(403).send("재고 부족!");
  }
  if (cashCheck !== cash) {
    return res.status(403).send("cash err");
  }
  //날짜로 오더넘버 만들기
  const today = new Date();
  let orderNumber = "";
  orderNumber += today.getFullYear();

  orderNumber +=
    today.getMonth() < "10" ? "0" + today.getMonth() : today.getMonth() + 1;

  orderNumber +=
    today.getDate() < "10" ? "0" + today.getDate() : today.getDate();

  orderNumber += orderCount;

  try {
    await prisma.user.update({
      //user 의 cash update
      where: {
        id: req.user.id,
      },
      data: {
        point: remainCash,
      },
    });
    productIdAndCount.forEach(async (idAndCount, i) => {
      //재고에서 물건삭제
      await prisma.product.update({
        where: {
          id: idAndCount.id,
        },
        data: {
          stock: newStock[i],
        },
      });
    });

    const ids = productIdAndCount.map((idAndCount) => {
      return { id: idAndCount.id };
    });
    const order = await prisma.order.create({
      //create order and connect order between product
      data: {
        orderNumber,
        user: {
          connect: {
            id: req.user.id,
          },
        },
        products: {
          connect: ids,
        },
        address1,
        address2,
        zipcode,
        name,
        message,
        phone,
      },

      include: {
        products: true,
      },
    });

    productIdAndCount.forEach(async (idAndCount) => {
      await prisma.productInOrderCount.create({
        data: {
          count: idAndCount.count,
          order: {
            connect: {
              id: order.id,
            },
          },
          product: {
            connect: {
              id: idAndCount.id,
            },
          },
        },
      });
    }); //물건과 수량을 productIdAndCount 테이블에 저장한다.

    orderCount = (orderCount + 1) % 10000;
    return res.status(200).json({ order, remainCash });
  } catch (error) {
    console.log(error);
  }
};

export const getOrderController = async (req, res) => {
  let order;
  if (req.user.isAdmin) {
    order = await prisma.order.findMany({
      include: {
        products: {
          orderBy: {
            id: "desc",
          },
        },
        ProductInOrderCount: {
          orderBy: {
            productId: "desc",
          },
        },
        user: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    order = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        products: {
          orderBy: {
            id: "desc",
          },
        },
        ProductInOrderCount: {
          orderBy: {
            productId: "desc",
          },
        },
        // reviews:{
        //     include:{
        //         product:{
        //             select:{
        //                 id:true
        //             }
        //         }
        //     }
        // }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  const newOrder = order.map((ord) => {
    const newProductsList = [];
    const len = ord.products.length;
    for (let i = 0; i < len; ++i) {
      const newProduct = ord.products[i];
      newProduct.count = ord.ProductInOrderCount[i].count;
      newProductsList.push(newProduct);
    }
    return {
      ...ord,
      products: newProductsList,
    };
  });
  return res.status(200).json(newOrder);
};
