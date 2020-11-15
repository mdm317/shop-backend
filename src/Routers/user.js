import {
  getUserController,
  loginController,
  joinController,
  checkIdController,
  editProfileController,
  logoutController,
  getProfileController,
  chargeCash,
} from "../Controllers/user";
import { isLogin } from "../middlewares";
const express = require("express");

const userRouter = express.Router();
userRouter.get("/", getUserController);
userRouter.get("/profile", isLogin, getProfileController);
userRouter.post("/login", loginController);
userRouter.post("/logout", logoutController);
userRouter.post("/join", joinController);
userRouter.get("/checkId", checkIdController);
userRouter.post("/editProfile", editProfileController);
userRouter.post("/chargeCash", chargeCash);

export default userRouter;
