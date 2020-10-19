// import '@babel/polyfill';
import "./db";
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
import productRouter from './Routers/product';
import qnaRouter from './Routers/qna';
import orderRouter from './Routers/order';
import basketRouter from './Routers/basket';
import reviewRouter from './Routers/review';
import imageRouter from './Routers/image';



const PORT = process.env.PORT || 4000;
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(helmet());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/* app.use((req, res, next) => { 
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Credentials", "true")  
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); 
        return res.status(200).json({});
    }
    next();
}) */
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave:false,   
    saveUninitialized: false,
    secret : process.env.COOKIE_SECRET,
    cookie:{
        httpOnly :true,
        secure : false,
    },
    name :'dvsev',
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const handleListening = () =>console.log(`✅ Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);


app.use('/user',userRouter);
app.use('/product', productRouter);
app.use('/qna', qnaRouter);
app.use('/order', orderRouter); 
app.use('/basket', basketRouter); 
app.use('/review', reviewRouter);
app.use('/image', imageRouter);

app.get('/',(req,res)=>{
    const point = 300;
    res.json({point});
})

app.use((err, req, res, next) => { // 에러 처리 부분
    console.error(err.stack); // 에러 메시지 표시
    res.status(500).send('서버 에러!'); // 500 상태 표시 후 에러 메시지 전송
});
export default app;