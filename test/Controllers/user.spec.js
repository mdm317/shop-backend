import app from '../../src/app';
import request from 'supertest';
import prisma from '../../src/db';
import should from 'should';
import bcypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();

const hasData = (datas)=>{
  return (res)=>{
    res.body.should.be.instanceof(Array);
    for(const obj of res.body){
      for(const data of datas){
        obj.should.have.property(data);
      }
    }
  }
}
describe("GET /user",()=>{

  describe("success", () => {
    before(async function() {
      await prisma.user.create({data:{userId:'i1',name:'n1',password:'p1',phone:'p1'}});
      await prisma.user.create({data:{userId:'i2',name:'n2',password:'p2',phone:'p2'}});
      await prisma.user.create({data:{userId:'i3',name:'n3',password:'p3',phone:'p3'}});
    });
    after(function () {
      return prisma.user.deleteMany();
    });
    it("유저 객체를 담은 배열로 응답한다", done => {
      request(app)
        .get("/user")
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(hasData(['userId','password','name','phone']))
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
})})


describe('POST /user/join', () => {
  after(function () {
    return prisma.user.deleteMany();
  });
  it('회원 가입 성공',done=>{
    request(app)
    .post('/user/join')
    .send({ userId: 'i1' ,password:'p1',name:'e1',phone:'p1'})
    .end((err,res)=>{
      if(err)throw err;
      res.status.should.be.equal(301);
      done();
    });
  });
})

describe("POST /user/login",()=>{

  before(async function() {
    const newpassword = await bcypt.hash('p1',Number(process.env.BCRYPTHASH));
    await prisma.user.create({data:{userId:"i1", password:newpassword,phone:'p1',name:'n1'}});
  });
  after(function () {
    return prisma.user.deleteMany();
  });
  it("아이디가 없을때",done=>{
    request(app)
    .post("/user/login")
    .send({userId:"id2",password:"p1"})
    .expect(res=>{
      res.status.should.be.equal(401);
      res.body.should.eql({"error":{"message":"존재하지 않는 사용자"}});
    }).end((err,res)=>{
      if(err)throw err;
      done();
    })


  });
  it("비밀번호가 틀릴때",done=>{
    request(app)
    .post("/user/login")
    .send({userId:"i1",password:"p2"})
    .expect(res=>{
      res.status.should.be.equal(401);
      res.body.should.eql({"error":{"message":"비밀번호가 틀립니다"}});
    }).end((err,res)=>{
      if(err)throw err;
      done();
    })
    
  });
  it('login 성공할 때', done=>{
    request(app)
    .post("/user/login")
    .send({userId:"i1",password:"p1"})
    .expect(200,done)
  });
})
describe('id 중복확인',()=>{
  before(async function() {
    const newpassword = await bcypt.hash('p1',Number(process.env.BCRYPTHASH));
    await prisma.user.create({data:{userId:"i1", password:newpassword,phone:'p1',name:'n1'}});
  });
  after(function () {
    return prisma.user.deleteMany();
  });
  it('id 가 중복일때 ',done=>{
    request(app)
    .get('/user/checkId?userId=i1')
    .expect(200,"아이디가 중복입니다.",done);
  })
  it('id 가 중복이 아닐때 ',done=>{
    request(app)
    .get('/user/checkId?userId=i2')
    .expect(200,"사용할 수 있는 아이디 입니다.",done);
  })
})

describe('edit post', ()=>{
  const agent = request.agent(app);
  before(async function() {
    const newpassword = await bcypt.hash('p1',Number(process.env.BCRYPTHASH));
    await prisma.user.create({data:{userId:"i1", password:newpassword,phone:'p1',name:'n1'}});
  });
  after(function () {
    return prisma.user.deleteMany();
  });
  it('login', done=>{
    agent
    .post("/user/login")
    .send({userId:"i1",password:"p1"})
    .expect(200,done)
  })
  it('edit profile', done=>{
    agent
    .post('/user/editProfile')
    .send({userId:"i2",password:"p2",email:'e2',phone:'p2'})
    .expect(301,done); 
  })
  // it('edit profile 성공',done=>{
  //    agent
  //   .post("/user/login")
  //   .send({userId:"i1",password:"p1"})
  //   .get('/')
  //   .expect(200,done);
  //   // .post('/user/editProfile')
  //   // .send({userId:"i2",password:"p2",email:'e2',phone:'p2'})
  //   // .expect(301,done); 
  // })
});