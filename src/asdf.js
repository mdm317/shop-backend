
const bcypt = require('bcrypt'); 
const dotenv = require('dotenv');
const { default: prisma } = require('./db');
dotenv.config();

async function a(){
    const newpassword = await bcypt.hash('admin',Number(process.env.BCRYPTHASH));
    const user = await prisma.user.create({data:{
        userId:"user", 
        password:newpassword,
        phone:'p1',
        name:'n1',
        isAdmin:false}});

}
a();