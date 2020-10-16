import prisma from '../db'
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
const filterPassword = (user)=>{
    delete user.password;
    return user;
}
export const getProfileController = async(req,res)=>{
    const basket = await prisma.basket.findOne({
        where:{
            userId:req.user.id
        },
        include:{
            products:{
                include:{
                    productImage:true
                }
            }
        }
    });
    const cart = basket? basket.products:[];
    return res.json({user:filterPassword(req.user),cart});

}
export const getUserController = async(req,res)=>{
    try {
        const {query:{id}} = req;
        const user = await prisma.user.findMany();
        res.json(filterPassword(user));
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
            console.log(info);
            return res.status(401).send({"error":{"message":info.reason}});
        }
        return req.login(user, async(loginErr)=>{   //seriallize 실행
            if(loginErr){
                return next(loginErr);
            }
            const basket = await prisma.basket.findOne({
                where:{
                    userId:user.id
                },
                include:{
                    products:{
                        include:{
                            productImage:true
                        }
                    }
                }
            });
            const cart = basket? basket.products:[];
            // const fulluser = await db.User.findOne({
            return res.json({user,cart});
        });
    })(req,res,next);
};

export const logoutController = async(req,res)=>{
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
}
export const checkIdController = async(req,res,next)=>{
    try {
        const {query:{userId}} = req;
        const user = await prisma.user.findOne({where:{userId}});
/*         if(user){
            return res.send('아이디가 중복입니다.')
        }
        res.send('사용할 수 있는 아이디 입니다.') */
        if(user){
            return res.json({possible:false,message:'아이디가 중복입니다.'})
        }
        res.json({possible:true,message:'아이디를 사용가능 합니다.'}) 
    } catch (error) {
        console.log(error);
        next(error);

    }

};
export const joinController = async(req,res,next)=>{
    try {
        const {userId, password, name, phone,email} = req.body;

        const hashedPassword = await bcrypt.hash(password,Number(process.env.BCRYPTHASH));
        await prisma.user.create({data:{
            userId, password:hashedPassword, name, phone,email
        }});
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        next(error);
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
            res.send(201).json(filterPassword(user));
        }
    } catch (error) {
        console.log(error);
    }

};

export const chargeCash = async(req,res)=>{
    const {cash} = req.body;
    const newCash = req.user.point +cash;
    await prisma.user.update({
        where:{
            id:req.user.id
        },
        data:{
            point:newCash
        }
    });
    res.status(201).json(newCash);
}
