import express from 'express';
import { addOrderController } from '../Controllers/order';
import { isLogin } from '../middlewares';

const orderRouter = express.Router();

orderRouter.post('/add', isLogin,addOrderController);

export default orderRouter;
