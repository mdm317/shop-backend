const prisma = require("./src/db");

const checkUser = async () => {
  console.log(await prisma.user.findMany({}));
};
checkUser();
