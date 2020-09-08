import express from 'express';
import { isLogin } from '../middlewares';
import { addQuestionController, addAnswerController, editQnaController, getQnasController } from '../Controllers/qna';

const qnaRouter = express.Router();

qnaRouter.post('/addQuestion',isLogin,addQuestionController);
qnaRouter.post('/addAnswer',isLogin,addAnswerController);
qnaRouter.post('/edit/:qId',isLogin,editQnaController);
qnaRouter.get('/get',isLogin, getQnasController)
export default qnaRouter;