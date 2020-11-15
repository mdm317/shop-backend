import prisma from "../db";

export const addReviewController = async (req, res) => {
  const { content, rating, image, productId } = req.body;
  const userBuyProduct = await prisma.userBuyProduct.findOne({
    where: {
      productId_userId: {
        productId,
        userId: req.user.id,
      },
    },
  });
  if (!userBuyProduct) {
    return res.status(403).send("you didn't buy product");
  }
  //이미 쓴 리뷰가 있는지 검사
  const exitreview = await prisma.review.findMany({
    where: {
      AND: [
        {
          productId,
        },
        {
          userId: req.user.id,
        },
      ],
    },
  });
  if (exitreview.length) {
    return res.status(403).send("you already review product");
  }
  const review = await prisma.review.create({
    data: {
      content,
      rating,
      image,
      user: {
        connect: {
          id: req.user.id,
        },
      },
      product: {
        connect: {
          id: productId,
        },
      },
    },
  });
  res.status(201).json(review);
};
