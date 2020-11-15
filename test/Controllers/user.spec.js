/*eslint-disable */
import app from "../../src/app";
import request from "supertest";
import should from "should";

import { addDataInDB, user } from "../addDataInDB";
import { resetDB } from "../resetDB";

//로그인 두번 하면??
before(addDataInDB);
after(resetDB);
const newUser = {
  userId: "user2",
  password: "pass2",
  name: "user",
  point: 10000,
};

describe("POST /user/join", () => {
  it("회원 가입 시도", (done) => {
    request(app)
      .post("/user/join")
      .send({ ...newUser })
      .expect(201, done);
  });
});

describe("POST /user/login", () => {
  it("아이디가 없을때", (done) => {
    request(app)
      .post("/user/login")
      .send({ userId: "wrongID", password: "p1" })
      .expect((res) => {
        res.status.should.be.equal(401);
        res.body.should.eql({ error: { message: "존재하지 않는 사용자" } });
      })
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });
  it("비밀번호가 틀릴때", (done) => {
    request(app)
      .post("/user/login")
      .send({ ...user, password: "wrong password" })
      .expect((res) => {
        res.status.should.be.equal(401);
        res.body.should.eql({ error: { message: "비밀번호가 틀립니다" } });
      })
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });
  it("login 성공할 때", (done) => {
    request(app)
      .post("/user/login")
      .send({ ...user })
      .expect(200, done);
  });
});
describe("id 중복확인", () => {
  it("id 가 중복일때 ", (done) => {
    request(app)
      .get(`/user/checkId?userId=${user.userId}`)
      .expect((res) => {
        res.body.should.have.property("message", "아이디가 중복입니다.");
        res.body.should.have.property("possible", false);
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
  it("id 가 중복이 아닐때 ", (done) => {
    request(app)
      .get("/user/checkId?userId=notExistId")
      .expect((res) => {
        res.body.should.have.property("message", "아이디를 사용가능 합니다.");
        res.body.should.have.property("possible", true);
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});