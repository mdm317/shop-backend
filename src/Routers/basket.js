import express from 'express';
import { emptyBasket, putProductInController, takeProductOutController } from '../Controllers/basket';
import { isLogin } from '../middlewares';

const basketRouter = express.Router();

basketRouter.post('/add',isLogin, putProductInController);
basketRouter.post('/delete', isLogin,takeProductOutController);
basketRouter.post('/empty', isLogin,emptyBasket);

export default basketRouter;
