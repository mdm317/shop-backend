/*eslint-disable */
import app from "../../src/app";
import request from "supertest";
import should from "should";
import { addDataInDB, admin, product, question, user } from "../addDataInDB";
import { resetDB } from "../resetDB";

before(addDataInDB);
after(resetDB);

describe("add Question", () => {
  const agent = request.agent(app);

  it("일반 사용자 계정으로 로그인", (done) => {
    agent
      .post("/user/login")
      .send({ ...user })
      .expect(200, done);
  });
  it("사용자가 질문 추가", (done) => {
    agent
      .post("/qna/addQuestion")
      .send({ title: "title", content: "er", productId: product.id })
      .expect(201, done);
  });
});
const answer = {
  title: "title",
  content: "content",
  qId: question.id,
  productId: product.id,
};
describe("add Answer", () => {
  describe("일반유저나 비로그인으로 답변등록 시도 시 ", () => {
    it("비로그인", (done) => {
      request(app)
        .post("/qna/addAnswer")
        .send({ ...answer })
        .expect(401, done);
    });
    describe("일반유저 로그인", () => {
      const agent = request(app);
      it("일반 사용자 계정으로 로그인", (done) => {
        agent
          .post("/user/login")
          .send({ ...user })
          .expect(200, done);
      });
      it("일반 사용자가 답변등록 시도", (done) => {
        agent
          .post("/qna/addAnswer")
          .send({ ...answer })
          .expect(401, done);
      });
    });
  });
  describe("admin 으로 등록 시도 시", () => {
    const agent = request.agent(app);

    it("admin 계정으로 로그인", (done) => {
      agent
        .post("/user/login")
        .send({ ...admin })
        .expect(200, done);
    });
    it("admin 이 답변 추가", (done) => {
      agent
        .post("/qna/addAnswer")
        .send({ ...answer })
        .expect(201, done);
    });
  });
});
