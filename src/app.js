import '@babel/polyfill';
import './db';
import passport from "passport"
import './passport';

import dotenv from 'dotenv';
dotenv.config();


import cors from 'cors';
const express = require('express');
const morgan = require('morgan');
const app = express();

import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRouter from "./Routers/user";
import expressSession from 'express-session';


const PORT = process.env.PORT || 4000;

app.use(helmet());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave:false,   
    saveUninitialized: false,
    secret : process.env.COOKIE_SECRET,
    cookie:{
        httpOnly :true,
        secure : false,
    },
    name :'rnbck',
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const handleListening = () =>console.log(`✅ Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);

app.use(cors());
app.use('/user',userRouter);
app.get('/',(req,res)=>{
    res.send('home');
})

app.get('/debug', (req,res)=>{
    res.json({
        "req.session": req.session, // 세션 데이터
        "req.user": req.user, // 유저 데이터(뒷 부분에서 설명)
        "req._passport": req._passport, // 패스포트 데이터(뒷 부분에서 설명)
      })
})
app.use((err, req, res, next) => { // 에러 처리 부분
    console.error(err.stack); // 에러 메시지 표시
    res.status(500).send('서버 에러!'); // 500 상태 표시 후 에러 메시지 전송
  });
export default app;