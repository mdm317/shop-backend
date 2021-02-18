const prisma = require("./db");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  const password = await bcrypt.hash("admin", Number(process.env.BCRYPTHASH));
  const admin = await prisma.user.create({
    data: {
      userId: "admin",
      password,
      name: "admin",
      isAdmin: true,
    },
  });
  console.log(admin);
};
createAdmin();
