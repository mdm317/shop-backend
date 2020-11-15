import prisma from "../db";

export const getProductsController = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        productImage: {
          orderBy: {
            idx: "asc",
          },
        },
      },
    });
    const notDeleteProducts = products.filter(
      (pro) => pro.willDelete === false
    );
    res.json(notDeleteProducts);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const addProductController = async (req, res) => {
  const {
    body: { price, stock, description, imgUrls, name },
  } = req;
  const urls = [];

  for (let i = 0; i < imgUrls.length; ++i) {
    if (i != 0) {
      const img = imgUrls[i];
      urls.push({ url: img.url, idx: Number(img.idx) });
    } //상품이미지 순서를 기억하기 위해 idx에 순서를 넣어준다.
  }
  let newThumbnail;
  if (imgUrls[0].url) {
    newThumbnail = imgUrls[0].url;
  } else {
    newThumbnail = imgUrls[1].url;
  }

  try {
    const product = await prisma.product.create({
      data: {
        price,
        stock,
        description,
        thumbnail: newThumbnail,
        name,
        productImage: {
          create: urls,
        },
      },
      include: {
        productImage: true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
export const willDeleteProductController = async (req, res) => {
  const { productId } = req.query;
  const product = await prisma.product.update({
    data: {
      willDelete: true,
    },
    where: {
      id: productId,
    },
  });
  res.status(201).json(product);
  //삭제하면 db에서 아에 삭제하지 않고 willdelete를 이용해
  //보이지 않게 해준다.
};
export const deleteProductController = async (req, res) => {
  const { productId } = req.query; //?
  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    res.status(201).send("deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const editProductController = async (req, res) => {
  const { id, price, stock, description, name } = req.body;
  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name,
      price,
      stock,
      description,
    },
    include: {
      productImage: true,
    },
  });
  res.status(201).json(product);
};
export const getOneProductController = async (req, res) => {
  const { productId } = req.query;
  const product = await prisma.product.findOne({
    where: {
      id: productId,
    },
    include: {
      qnas: {
        include: {
          user: true,
          answer: true,
          question: true,
          product: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      productImage: {
        orderBy: {
          idx: "asc",
        },
      },
    },
  });
  res.status(201).json(product);
};
