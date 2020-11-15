import prisma from "../db";

export const putProductInController = async (req, res) => {
  const { productId } = req.body;
  const basket = await prisma.basket.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      products: true,
    },
  });
  if (!basket.length) {
    //장바구니가 없으면 새로만들고 product와 연결하고 담은 product 를 반환한다
    const productTobasket = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        baskets: {
          create: {
            user: {
              connect: {
                id: req.user.id,
              },
            },
          },
        },
      },
      include: {
        productImage: true,
      },
    });

    return res.status(201).json(productTobasket);
  } else if (basket.length === 1) {
    const probaskets = await prisma.product.findOne({
      where: {
        id: productId,
      },
      include: {
        baskets: true,
      },
    });
    let exist = 0;
    probaskets.baskets.forEach((basketsEl) => {
      if (basketsEl.id === basket[0].id) {
        exist = 1;
      }
    });
    if (exist) {
      //이미 담은 물건인지 검사하고 이미 담은 물건일 경우
      //db를 수정하지 않고status200 반환한다.
      return res.sendStatus(200);
    }
    const productTobasket = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        baskets: {
          connect: {
            id: basket[0].id,
          },
        },
      },
      include: {
        productImage: true,
      },
    });

    return res.status(201).json(productTobasket);
    //새로운 물건일시 cart랑 연결하고 반환한다.
  }
  res.sendStatus(500);
};

export const takeProductOutController = async (req, res) => {
  const { productId } = req.body;
  const basket = await prisma.basket.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      products: true,
    },
  });
  if (basket.length != 1) {
    return res.sendStatus(403);
  }
  if (basket[0].products.length == 0) {
    return res.sendStatus(403);
  }
  const newBasket = await prisma.basket.update({
    where: {
      id: basket.id,
      userId: req.user.id,
    },
    data: {
      products: {
        disconnect: {
          id: productId,
        },
      },
    },
    include: {
      products: {
        include: {
          productImage: true,
        },
      },
    },
  });
  res.status(201).json(newBasket.products);
};
export const emptyBasket = async (req, res) => {
  const basket = await prisma.basket.findOne({
    where: {
      userId: req.user.id,
    },
    include: {
      products: {
        select: {
          id: true,
        },
      },
    },
  });
  const ids = basket.products.map((pro) => ({
    id: pro.id,
  }));
  await prisma.basket.update({
    where: {
      userId: req.user.id,
    },
    data: {
      products: {
        disconnect: ids,
      },
    },
  });
  return res.status(201).json([]);
};
