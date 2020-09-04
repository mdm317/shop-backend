const passport = require("passport");


export const isAuthByPassport = 
(req,res,next)=>{
    passport.authenticate('local', (err, user, info)=>{

        if(err){
            console.error(err);
            throw error;
            return next(err);
        }
        if(info){
            return res.status(402).send(info.reason);
        }
        next()
    })(req,res,next);
}


