import { getUserController, loginController, joinController, checkIdController, editProfileController } from '../Controllers/user';
import passport from 'passport';
import {isAuthByPassport} from '../middlewares';
const express = require('express');

const userRouter =  express.Router();
userRouter.get('/', getUserController);
userRouter.post('/login', loginController);
userRouter.post('/join', joinController);
userRouter.get('/checkId', checkIdController);
userRouter.post('/editProfile', editProfileController);



export default userRouter;