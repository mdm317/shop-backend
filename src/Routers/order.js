import express from "express";
import { addOrderController, getOrderController } from "../Controllers/order";
import { isLogin } from "../middlewares";

const orderRouter = express.Router();

orderRouter.get("/", isLogin, getOrderController);
orderRouter.post("/add", isLogin, addOrderController);

export default orderRouter;
