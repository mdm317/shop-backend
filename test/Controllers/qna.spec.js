import app from '../../src/app';
import request from 'supertest';
import prisma from '../../src/db';
import should from 'should';

import {hasData} from './utils';

import bcypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();

describe('Qna Controller Test',()=>{
    let productId="";
    let qId="";
    let userId="";
    let adminId = "";
    before(async function(){
        const price=1,
        stock=1,
        description='a',
        thumbnail='tq',
        imageUrl='url1';
        const product = await prisma.product.create({data:{
            price, 
            stock, 
            description, 
            thumbnail, 
            imageUrl}});
        productId = product.id;
        const newpassword = await bcypt.hash('p',Number(process.env.BCRYPTHASH));
        const user = await prisma.user.create({data:{
            userId:"user", 
            password:newpassword,
            phone:'p1',
            name:'n1',
            isAdmin:false}});
        const admin = await prisma.user.create({data:{
            userId:"admin", 
            password:newpassword,
            phone:'p2',
            name:'n2',
            isAdmin:true}});
        userId = user.id;
        adminId = admin.id;
        const qna = await prisma.qna.create({data:{
            title:'title',
            content:'c',
            user:{
                connect:{
                    id:userId
                }
            },
            product:{
                connect:{
                    id:productId
                }
            }
        }});
        qId = qna.id;
        
    });
    after(async function(){
        await prisma.qna.deleteMany();
        await prisma.product.deleteMany();
        await prisma.user.deleteMany();
    })
    describe('add Question', ()=>{
        const agent = request.agent(app);

        after(async function(){
            await prisma.qna.deleteMany({where:{content:'er'}})
        })
        it('일반 사용자 계정으로 로그인',done=>{
            agent
            .post("/user/login")
            .send({userId:"user",password:"p"})
            .expect(200,done);
        });
        it('사용자가 질문 추가',done=>{
            agent
            .post('/qna/addQuestion')
            .send({title:"title", content:"er", productId})
            .expect(res=>{
                res.status.should.be.eql(201);
                res.body.should.have.property("title");
                res.body.should.have.property("content");
                res.body.should.have.property("productId");
            }).end((err,res)=>{
                if(err)throw err;
                done();
            });
        })
    }) 
   
    describe('add Answer', ()=>{
        describe('일반유저나 비로그인으로 답변등록 시도 시 ', () => {
            it('비로그인', done => {
                request(app)
                .post('/qna/addAnswer')
                .send({title:"title", content:"content", qId,productId})
                .expect(403,done);
            });
            describe('일반유저 로그인', ()=>{
                const agent = request(app);
                it('일반 사용자 계정으로 로그인',done=>{
                    agent
                    .post("/user/login")
                    .send({userId:"user",password:"p"})
                    .expect(200,done);
                });
                it('일반 사용자가 답변등록 시도',done=>{
                    agent
                    .post('/qna/addAnswer')
                    .send({title:"title", content:"content", qId,productId})
                    .expect(403,done);
                })       
            })
        });
        describe('admin 으로 등록 시도 시',()=>{
            const agent = request.agent(app);

            it('admin 계정으로 로그인',done=>{
                agent
                .post("/user/login")
                .send({userId:"admin",password:"p"})
                .expect(200,done);
            });
            it('admin 이 답변 추가',done=>{
                agent
                .post('/qna/addAnswer')
                .send({title:"title", content:"content", qId,productId})
                .expect(res=>{
                    console.log(res.body);
                }).end((err,res)=>{
                    if(err)throw err;
                    done();
                });
            })
        })
    })
    describe('edit qna controller',()=>{
        const NEWTITLE="new title";
        const NEWCONTENT = 'new content';
        it('비로그인 으로 수정 요청', done=>{
            request(app)
            .post(`/qna/edit/${qId}`)
            .send({title:NEWTITLE, content:NEWCONTENT})
            .expect(403,done);
          
        });
        describe('자기가 쓴질문에 수정 요청 ',()=>{
            const agent = request.agent(app);
            it('login', done=>{
                agent
                .post("/user/login")
                .send({userId:"user",password:"p"})
                .expect(200,done);
            })
            it('call edit', done=>{
                agent
                .post(`/qna/edit/${qId}`)
                .send({title:NEWTITLE, content:NEWCONTENT})
                .expect(res=>{
                    res.status.should.be.eql(201);
                    res.body.should.containEql({ title:NEWTITLE});
                    res.body.should.containEql({ content:NEWCONTENT});
                })
                .end(err=>{
                    if(err)return done(err);
                    done();
                })
            })
        });
        describe('남의 쓴질문에 수정 요청 ',()=>{
            const agent = request.agent(app);
            it('login', done=>{
                agent
                .post("/user/login")
                .send({userId:"admin",password:"p"})
                .expect(200,done);
            })
            it('call edit', done=>{
                agent
                .post(`/qna/edit/${qId}`)
                .send({title:NEWTITLE, content:NEWCONTENT})
                .expect(403,done);
            })
        });
     
    })
    describe('get qnas controller', () => {
        it('not login', done => {
            request(app)
            .get('/qna/get')
            .expect(403,done);
        });
        describe('login and get qnas',()=>{
            before(async function(){
                await prisma.qna.create({data:{
                    title:'title',
                    content:'er',
                    user:{
                        connect:{
                            id:userId
                        }
                    },
                    product:{
                        connect:{
                            id:productId
                        }
                    }
                }});
                await prisma.qna.create({data:{
                    title:'title',
                    content:'er',
                    user:{
                        connect:{
                            id:userId
                        }
                    },
                    product:{
                        connect:{
                            id:productId
                        }
                    }
                }});
            })
            after(async function(){
                await prisma.qna.deleteMany({where:{content:"er"}});
            })
            const agent = request.agent(app);
            it('login', done=>{
                agent
                .post("/user/login")
                .send({userId:"user",password:"p"})
                .expect(200,done);
            });
            it('call getqnas ', done=>{
                agent
                .get('/qna/get')
                .expect(200)
                .expect(hasData(3,["title" ,"content"]))
                .end(err=>{
                    if(err)return done(err);
                    done();
                })
            });
            
        
            
        })
        
        
    });
    
});
