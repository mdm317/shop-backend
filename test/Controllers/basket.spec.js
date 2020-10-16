//똑같은 물건에 장바구니를 담을 경우는?
//현재는 db가 바뀌거나 하짆 안는다

import app from '../../src/app';
import request from 'supertest';
import prisma from '../../src/db';
import should from 'should';
import bcypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();
let id1,id2,id3;

let admin;
before(async function(){
    const newpassword = await bcypt.hash('admin',Number(process.env.BCRYPTHASH));
 /*    admin = await prisma.user.create({data:{
        userId:"admin", 
        password:newpassword,
        name:'n1',
        isAdmin:true}}); */
        admin= await prisma.user.findOne({
            where:{
                userId:"admin"
            }
        })
    const price=1,
    stock=1,
    description='a',
    thumbnail='tq',
    imageUrl='url1';
/*     const {id:id_1} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    const {id:id_2} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    const {id:id_3} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    id1 = id_1;
    id2 = id_2;
    id3 = id_3; */
});
after(async function(){
    // await prisma.user.deleteMany();
    // await prisma.basket.deleteMany();
    // await prisma.product.deleteMany();
});


/* 
describe('basket  controller',()=>{
    const agent = request.agent(app);
    it('login',done=>{
        agent
        .post("/user/login")
        .send({userId:"user",password:"p"})
        .expect(200,done);
    });
    it('post putProductInController',done=>{
        agent
        .post("/basket/add")
        .send({productId: id1})
        .expect(201)
        .expect(res=>{
            res.body.products.should.be.instanceof(Array);
        })
        .end(err=>{
            if(err)return done(err);
            done();
        })
    });    
    it('post putProductInController again',done=>{
        agent
        .post("/basket/add")
        .send({productId: id2})
        .expect(201)
        .expect(res=>{
            res.body.should.have.keys('products');
            res.body.products.should.be.instanceof(Array);
            res.body.products.should.have.length(2);
        })
        .end(err=>{
            if(err)return done(err);
            done();
        })
    }); 
    it('post putProductInController again',done=>{
        agent
        .post("/basket/delete")
        .send({productId: id1})
        .expect(201,done)
    }); 
});

 */