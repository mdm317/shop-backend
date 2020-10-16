export const isLogin = (req,res,next)=>{
    if(!req.user){
        return res.status(401).send('You need to login');
    }
    next();
}
export const isAdmin= (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        return res.status(401).send('You need to login admin');

    }
}