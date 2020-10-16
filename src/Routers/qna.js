import express from 'express';
import { isAdmin, isLogin } from '../middlewares';
import { getQuestionController,addQuestionController, addAnswerController, editQnaController, getQnasController, getQuestionByProduct, getAllQnasController } from '../Controllers/qna';

const qnaRouter = express.Router();

qnaRouter.post('/addQuestion',isLogin,addQuestionController);
qnaRouter.post('/addAnswer',isLogin,addAnswerController);
qnaRouter.post('/edit/:qId',isLogin,editQnaController);
qnaRouter.get('/user/getquestion',isLogin, getQnasController)
qnaRouter.get('/product/getquestion', getQuestionByProduct)
qnaRouter.get('/all',isAdmin, getAllQnasController);
qnaRouter.get('/all',isAdmin, getAllQnasController);
qnaRouter.get('/getquestion', getQuestionController)



export default qnaRouter;