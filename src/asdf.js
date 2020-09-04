const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const passport = require('passport');

router.post('/', (req, res)=>{
    if(!req.user){
        return res.status(401).send("로그인이 필요합니다")
    }
    const fulluser = Object.assign({}, req.user.toJSON());
    console.log(fulluser);
    delete fulluser.password;
    return res.json(fulluser)
})
router.post('/logout', (req, res) => { // /api/user/logout
    console.log('first');
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
  });
router.post('/signUp', async(req, res)=>{ //회원가입
    try {
        //console.log(req.body);
        const exUser = await db.User.findOne({
            where :{
                userId: req.body.userId
            }
        })
        if(exUser){
            res.status(403).send("이미 사용중인 아이디 입니다");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser    = await db.User.create({
            nickname: req.body.nickname,
            userId :req.body.userId,
            password : hashedPassword,
        });
        console.log(newUser);
        return res.json(newUser);
    } catch (error) {
        console.log(error);
        res.status(200).send(error);
    }
});
router.post('/login', (req,res,next)=>{
    passport.authenticate('local', (err, user, info)=>{

        if(err){
            console.error(err);
            return next(err);
        }
        if(info){
            return res.status(402).send(info.reason);
        }
        return req.login(user, async(loginErr)=>{
            if(loginErr){
                return next(loginErr);
            }
            const fulluser = await db.User.findOne({
                 where : {id : user.id},
                 
                 include:[{
                    model:db.Post,
                    as:'Posts',
                    attributes : ['id']
                 },{
                    model:db.User,
                    as:'Followers',
                    attributes : ['id']
                 },{
                    model:db.User,
                    as:'Followings',
                    attributes : ['id']
                 },],
                 
                 attributes : ['id','userId','nickname']
            })
            //console.log(fulluser);
            return res.json(fulluser);
        });
    })(req,res,next);
});
router.get('/test', (req, res)=>{
    console.log('get test 실행');
    //console.log('디시얼라이즈 실행???');
})
router.post('/test', (req, res)=>{
    console.log('post test 실행');
    //console.log('디시얼라이즈 실행???');
})

module.exports = router;