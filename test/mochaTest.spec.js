import add from './mochaTest';
import should from 'should';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/db';
import bcypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();

describe('agent  request 의 연결 지속성 차이', ()=>{
  const password = "p1";
  before(async()=>{
    const newpassword = await bcypt.hash('p1',Number(process.env.BCRYPTHASH));
    await prisma.user.create({data:{userId:"i1", password:newpassword,phone:'p1',name:'n1'}});
    app.get('/haveCookie',(req,res)=>{
      res.send(req.signedCookies);
    })
  })
  after(()=>{
    return prisma.user.deleteMany();
  })

  describe('agent',()=>{
    const agent = request.agent(app);
    it('login',done=>{
      agent
      .post('/user/login')
      .send({ userId: 'i1' ,password:'p1'})
      .end((err,res)=>{
        if(err)throw err;
        res.status.should.be.equal(200);
        done();
      });
    })    
    it('have cookie?',done=>{
      agent
      .get('/haveCookie')
      .expect(res=>{
        res.body.should.have.key('rnbck');
      }).expect(200,done)
    })   
  });
  describe('request',()=>{
    // const agent = request.agent(app);
    it('login',done=>{
      request(app)
      .post('/user/login')
      .send({ userId: 'i1' ,password:'p1'})
      .end((err,res)=>{
        if(err)throw err;
        res.status.should.be.equal(200);
        done();
      });

    })    
    it('auth',done=>{
      request(app)
      .get('/haveCookie')
      .expect(res=>{
        res.body.should.be.empty();


      }).expect(200,done)
    })   
  })
})
