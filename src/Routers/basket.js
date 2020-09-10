import express from 'express';
import { putProductInController, takeProductOutController } from '../Controllers/basket';
import { isLogin } from '../middlewares';

const basketRouter = express.Router();

basketRouter.post('/add',isLogin, putProductInController);
basketRouter.post('/delete', isLogin,takeProductOutController);

export default basketRouter;
