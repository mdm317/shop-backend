const { default: prisma } = require("./es6-db")
const bcrypt  =require('bcrypt');

const createAdmin = async ()=>{
    const password = await bcrypt.hash('admin',Number(process.env.BCRYPTHASH));
    prisma.user.create({
        data:{
            userId:"admin",
            password,
            name:"admin",
            isAdmin:true,
        }
    })
}
createAdmin();