import express from 'express';
import { getProductsController, addProductController, willDeleteProductController, deleteProductController } from '../Controllers/product';

const productRouter = express.Router();
productRouter.get('/', getProductsController);
productRouter.post('/add', addProductController);
productRouter.post('/willdelete', willDeleteProductController);
productRouter.post('/delete', deleteProductController);

export default productRouter;