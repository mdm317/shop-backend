import express from "express";
import {
  getProductsController,
  addProductController,
  willDeleteProductController,
  editProductController,
  getOneProductController,
} from "../Controllers/product";
import { isAdmin } from "../middlewares";

const productRouter = express.Router();
productRouter.get("/", getProductsController);
productRouter.get("/detail", getOneProductController);
productRouter.post("/add", isAdmin, addProductController);
productRouter.post("/willdelete", isAdmin, willDeleteProductController);
productRouter.post("/edit", isAdmin, editProductController);

export default productRouter;
