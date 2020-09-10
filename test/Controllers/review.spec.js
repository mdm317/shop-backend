import app from '../../src/app';
import request from 'supertest';
import prisma from '../../src/db';
import should from 'should';

import {hasData} from './utils';

import bcypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();

let productId;
let productIds=[];
let notbuyProductId;
before(async function(){
    const newpassword = await bcypt.hash('p',Number(process.env.BCRYPTHASH));
    await prisma.user.create({data:{
        userId:"user", 
        password:newpassword,
        phone:'p1',
        name:'n1',
    }});
    const price=1,
    stock=1,
    description='a',
    thumbnail='tq',
    imageUrl='url1';
    const {id:id1} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    const {id:id2} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    const {id:id3} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    const {id:id4} =await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl}});
    productIds = [id1,id2,id3];
    productId = id1;
    notbuyProductId = id4;
});
after(async function(){
    await prisma.review.deleteMany();
    await prisma.userBuyProduct.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
});
describe('add review test', () => {
    it('not login',done=>{
        request(app)
        .post('/review/add')
        .send({content:"c1", rating:4, image:"url", productId})
        .expect(403,done);
    })
    describe('login', () => {
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
        it('post /review/add',done=>{
            agent
            .post('/review/add')
            .send({content:"c1", rating:4, image:"url", productId})
            .expect(201)
            .expect(hasData(1,["content", "rating", "image", "productId"]))
            .end(err=>{
                if(err)return done(err);
                done();
            });
        })
        it('post /review/add again',done=>{
            agent
            .post('/review/add')
            .send({content:"c1", rating:4, image:"url", productId})
            .expect(403)
            .expect(res=>{
                res.text.should.be.eql('you already review product');
            })
            .end(err=>{
                if(err)return done(err);
                done();
            });
        })
        it('post /review/add not buyitem',done=>{
            agent
            .post('/review/add')
            .send({content:"c1", rating:4, image:"url", productId:notbuyProductId})
            .expect(403)
            .expect(res=>{
                res.text.should.be.eql("you didn't buy product");
            })
            .end(err=>{
                if(err)return done(err);
                done();
            });
        })
        
    })
    
});
