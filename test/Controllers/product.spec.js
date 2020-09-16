import app from '../../src/app';
import request from 'supertest';
import prisma from '../../src/db';
import should from 'should';
import bcypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();

const hasDataType = (dataConstructor,dataLen,datas)=>{
    return (res)=>{
        res.body.should.be.instanceof(dataConstructor);
        res.body.should.have.length(dataLen);
        for(const obj of res.body){
            for(const data of datas){
            obj.should.have.property(data);
            }
        }
    }
}
describe('product controllers test ', ()=>{
    let productId;
    const adminId = 'admin',adminPass='admin';
    const userId = 'user',userPass='admin';
    before(async function(){
        const price=1,
        name='n1',
        stock=1,
        description='a',
        thumbnail='tq',
        imageUrl='url1';
        const product = await prisma.product.create({data:{price:2, stock, description, thumbnail, imageUrl,name}});
        await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl,name}});
        await prisma.product.create({data:{price, stock, description, thumbnail, imageUrl,willDelete:true,name}});

        const newpassword = await bcypt.hash(adminPass,Number(process.env.BCRYPTHASH));
        await prisma.user.create({data:{userId:adminId, 
            password:newpassword,
            name:'admin',
            isAdmin:true}});

        await prisma.user.create({data:{userId, 
            password:newpassword,
            name:'n2',
            isAdmin:false}});

        productId = product.id;
    });
    after(async function(){
        await prisma.product.deleteMany();
        await prisma.user.deleteMany();
    })
    describe('get products controller',()=>{

        it('상품들 얻어오기', (done)=>{
            request(app)
            .get('/product')
            .expect(hasDataType(Array,2,["price", "stock", "imageUrl"]))
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                done();
            })
        });
    });
    describe('add products controler',()=>{
        describe('admin 으로 추가 할때 ',()=>{
            const agent = request.agent(app);
            it('admin 계정으로 로그인',done=>{
                agent
                .post("/user/login")
                .send({userId:adminId,password:adminPass})
                .expect(200,done);
            });
            it('product 추가', done=>{
                agent
                .post('/product/add')
                .send({price:12, stock:12, imageUrl:'urladd',name:'s'})
                .expect(201,done);
            })
        });
        describe('일반사용자가 추가요청을 보낼 때 ',()=>{
            const agent = request.agent(app);
            it('일반 계정으로 로그인',done=>{
                agent
                .post("/user/login")
                .send({userId,password:userPass})
                .expect(200,done);
            });
            it('product 추가', done=>{
                agent
                .post('/product/add')
                .send({price:12, stock:12, imageUrl:'urladd'})
                .expect(403,done);
            })
        })
       

    })

    describe('willdelete controller', ()=>{
        describe('일반사용자가 요청',()=>{
            const agent = request.agent(app);
            it('일반 계정으로 로그인',done=>{
                agent
                .post("/user/login")
                .send({userId:userId,password:userPass})
                .expect(200,done);
            });
            it('product 추가', done=>{
                agent
                .post('/product/add')
                .send({price:12, stock:12, imageUrl:'urladd'})
                .expect(403,done);
            })
        })
        describe('admin 이 호출', ()=>{
            const agent = request.agent(app);
            it('admin 계정으로 로그인',done=>{
                agent
                .post("/user/login")
                .send({userId:adminId,password:adminPass})
                .expect(200,done);
            });

            it('product 인스턴스에 willdelete를 true 로 만듬',done=>{
                agent
                .post(`/product/willdelete?productId=${productId}`)
                .expect(res=>{
                    res.status.should.be.eql(201);
                    res.body.willDelete.should.be.eql(true);
                })
                .end((err,res)=>{
                    if(err)return done(err);
                    done();
                })
    
            })
        })
       
    })
    describe('delete controller', ()=>{
        it('delete', done=>{
            request(app)
            .post(`/product/delete?productId=${productId}`)
            .expect(403,done);
        })
    })
})