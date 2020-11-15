import express from "express";
import { isLogin } from "../middlewares";
import { addReviewController } from "../Controllers/review";

const reviewRouter = express.Router();

reviewRouter.post("/add", isLogin, addReviewController);

export default reviewRouter;
