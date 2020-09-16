import express from 'express';
import { getProductsController, addProductController, willDeleteProductController, deleteProductController } from '../Controllers/product';
import { isAdmin } from '../middlewares';

const productRouter = express.Router();
productRouter.get('/', getProductsController);
productRouter.post('/add',isAdmin, addProductController);
productRouter.post('/willdelete',isAdmin, willDeleteProductController);
productRouter.post('/delete',isAdmin, deleteProductController);

export default productRouter;