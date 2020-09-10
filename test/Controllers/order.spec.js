import app from '../../src/app';
import request from 'supertest';
import prisma from '../../src/db';
import should from 'should';
import bcypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();
let productIds=[];
before(async function(){
    const newpassword = await bcypt.hash('p',Number(process.env.BCRYPTHASH));
    await prisma.user.create({data:{
        userId:"user", 
        password:newpassword,
        phone:'p1',
        name:'n1',
        isAdmin:true,
    }});
    const price=1,
    stock=1,
    description='a',
    thumbnail='tq',
    imageUrl='url1';
    const {id:id1} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    const {id:id2} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    const {id:id3} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    productIds = [id1,id2,id3];
});
after(async function(){
    await prisma.userBuyProduct.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
})
describe('add order controller', () => {
    describe('로그인 안하고 요청', ()=>{
        it('post /order/add',done=>{
            request(app)
            .post('/order/add')
            .send({productIds})
            .expect(403,done);
          
        });
    })
    describe('로그인후 요청', ()=>{
        const agent = request.agent(app);
        it('login',done=>{
            agent
            .post("/user/login")
            .send({userId:"user",password:"p"})
            .expect(200,done);
        });
        it('post /order/add',done=>{
            agent
            .post('/order/add')
            .send({productIds})
            .expect(res=>{
                res.body.should.have.property('orderNumber');
                res.body.products.should.be.instanceof(Array);
            })
            .end(err=>{
                if(err)return done(err);
                done();
            })
          
        });
      
    });
});
