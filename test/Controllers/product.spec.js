/*eslint-disable */
import app from "../../src/app";
import request from "supertest";
import should from "should";
import { addDataInDB, admin, product, user } from "../addDataInDB";
import { resetDB } from "../resetDB";

before(addDataInDB);
after(resetDB);

describe("get products ", () => {
  it("상품들 얻어오기", (done) => {
    request(app).get("/product").expect(200, done);
  });
});
const newProduct = {
  name: "pro3",
  price: 300,
  stock: 10,
  imgUrls: [{}, { url: "pro3url1", idx: 0 }],
};
describe("add products", () => {
  describe("admin 으로 추가 할때 ", () => {
    const agent = request.agent(app);
    it("admin 계정으로 로그인", (done) => {
      agent
        .post("/user/login")
        .send({ ...admin })
        .expect(200, done);
    });
    it("product 추가", (done) => {
      agent
        .post("/product/add")
        .send({ ...newProduct })
        .expect(201, done);
    });
  });
  describe("일반사용자가 추가요청을 보낼 때 ", () => {
    const agent = request.agent(app);
    it("일반 계정으로 로그인", (done) => {
      agent
        .post("/user/login")
        .send({ ...user })
        .expect(200, done);
    });
    it("product 추가", (done) => {
      agent
        .post("/product/add")
        .send({ ...newProduct })
        .expect(401, done);
    });
  });
});
describe("edit products", () => {
  const newProduct = {
    id: product.id,
    name: "pro4",
    price: 3000,
    stock: 100,
  };
  describe("수정 요청시 ", () => {
    const agent = request.agent(app);
    it("admin 계정으로 로그인", (done) => {
      agent
        .post("/user/login")
        .send({ ...admin })
        .expect(200, done);
    });
    it("product 추가", (done) => {
      agent
        .post("/product/edit")
        .send({ ...newProduct })
        .expect(201, done);
    });
  });
});
