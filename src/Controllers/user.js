import prisma from '../db'
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
export const getUserController = async(req,res)=>{
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.log(error);
    }

}

// export const loginController = async(req,res)=>{
//     res.send('hi?');
// }
export const loginController = async(req,res,next)=>{
    passport.authenticate('local', (err, user, info)=>{
        if(err){
            console.error(err);
            return next(err);
        }
        if(info){
            return res.status(401).send({"error":{"message":info.reason}});
        }
        return req.login(user, async(loginErr)=>{
            if(loginErr){
                return next(loginErr);
            }

            // const fulluser = await db.User.findOne({
            return res.json(user);
        });
    })(req,res,next);
};
export const checkIdController = async(req,res,next)=>{
    try {
        const {query:{userId}} = req;
        const user = await prisma.user.findOne({where:{userId}});
        if(user){
            res.send('아이디가 중복입니다.')
        }
        res.send('사용할 수 있는 아이디 입니다.')
    } catch (error) {
        console.log(error);
    }

};
export const joinController = async(req,res,next)=>{
    try {
        const {userId, password, name, phone} = req.body;
        const hashedPassword = await bcrypt.hash(password,Number(process.env.BCRYPTHASH));
        await prisma.user.create({data:{
            userId, password:hashedPassword, name, phone
        }});
        res.redirect(301,'/');
    } catch (error) {
        console.log(error);
    }

};
export const editProfileController = async(req,res,next)=>{
    try {
        const {userId, password, email, phone} = req.body;
        if(req.user){
            const user = prisma.user.findOne({id:req.user.id});
            await prisma.user.update({where:{
                id:req.user.id
            },data:{userId, password, email, phone}});
            res.redirect(301,'/user/profile');
        }
    } catch (error) {
        console.log(error);
    }

};
