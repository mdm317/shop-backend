/*eslint-disable */
import app from "../../src/app";
import request from "supertest";
import should from "should";

import { addDataInDB, product, productTwo, user } from "../addDataInDB";
import { resetDB } from "../resetDB";

before(addDataInDB);
after(resetDB);

const productIdAndCount = [{ id: product.id, count: 2 }],
  cash = product.price * 2,
  address1 = "address1",
  address2 = "address2",
  zipcode = "1234",
  name = "name",
  message = "안전 배송",
  phone = "123123123";
const productIdAndCount2 = [{ id: productTwo.id, count: 2 }];
const cash2 = productTwo.price * 2;
const productIdAndCount3 = [{ id: product.id, count: 6 }];
const cash3 = product.price * 6;

describe("add order controller", () => {
  describe("로그인 안하고 주문 요청", () => {
    it("post /order/add", (done) => {
      request(app)
        .post("/order/add")
        .send({
          productIdAndCount,
          cash,
          address1,
          address2,
          zipcode,
          name,
          message,
          phone,
        })
        .expect(401, done);
    });
  });
  describe("로그인후 요청", () => {
    const agent = request.agent(app);
    it("login", (done) => {
      agent
        .post("/user/login")
        .send({ ...user })
        .expect(200, done);
    });
    it("재고가 부족할 때 '재고 부족!'메세지를 받아야함", (done) => {
      agent
        .post("/order/add")
        .send({
          productIdAndCount: productIdAndCount3,
          cash: cash3,
          address1,
          address2,
          zipcode,
          name,
          message,
          phone,
        })
        .expect(403)
        .expect((res) => {
          res.text.should.match(/재고 부족!/);
        })
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it("돈이 부족할 때 'you need to recharge point'메세지를 받아야함", (done) => {
      agent
        .post("/order/add")
        .send({
          productIdAndCount: productIdAndCount2,
          cash: cash2,
          address1,
          address2,
          zipcode,
          name,
          message,
          phone,
        })
        .expect(403)
        .expect((res) => {
          res.text.should.match(/you need to recharge point/);
        })
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
    it("post /order/add", (done) => {
      agent
        .post("/order/add")
        .send({
          productIdAndCount,
          cash,
          address1,
          address2,
          zipcode,
          name,
          message,
          phone,
        })
        .expect(200)
        .expect((res) => {
          res.body.should.have.property("order");
          res.body.should.have.property("remainCash");
        })
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
  });
});
describe("get order Controller", () => {
  describe("login 안하고 요청", () => {
    it("get /order", (done) => {
      request(app).get("/order").expect(401, done);
    });
  });
  describe("user 가 요청", () => {
    const agent = request.agent(app);
    it("login", (done) => {
      agent
        .post("/user/login")
        .send({ ...user })
        .expect(200, done);
    });
    it("get /order", (done) => {
      agent.get("/order").expect(200, done);
    });
  });
});
