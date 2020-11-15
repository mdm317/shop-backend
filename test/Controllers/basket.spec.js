/*eslint-disable */
import app from "../../src/app";
import request from "supertest";
import should from "should";

import { addDataInDB, product, user } from "../addDataInDB";
import { resetDB } from "../resetDB";

before(addDataInDB);
after(resetDB);
const productId = product.id;
it("비로그인시 장바구니 담기 요청시 401을 반환한다.", (done) => {
  request(app)
    .post("/basket/add")
    .send({ productId: productId })
    .expect(401, done);
});

describe("basket  controller with login", () => {
  const agent = request.agent(app);

  it("login requset", (done) => {
    agent
      .post("/user/login")
      .send({ ...user })
      .expect(200, done);
  });
  it("장바구니에 성공적으로 담으면 담은 product 를 반환한다", (done) => {
    agent
      .post("/basket/add")
      .send({ productId: productId })
      .expect(201)
      .expect((res) => {
        res.body.should.have.property("id", productId);
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
  it("중복된 product 를 담으면 빈 문자열을 반환한다.", (done) => {
    agent.post("/basket/add").send({ productId: productId }).expect(200, done);
  });
});
