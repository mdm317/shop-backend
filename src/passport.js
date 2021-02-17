import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./db";

passport.serializeUser((user, done) => {
  return done(null, user.id);
});
//사용자의 정보를 서버에 저장하면 공간이 많이 들기 때문에
// id와 cookie만 가지고 있는다.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return done(null, user); //req.user
  } catch (error) {
    console.error(error);
    return done(error);
  }
});
//사용자의 정보를 mysql 에서 부여한id를 가지고 다시 정보를 불러온다
passport.use(
  new Strategy(
    {
      usernameField: "userId",
      passwordField: "password",
    },
    async (userId, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { userId },
        });

        if (!user) {
          return done(null, false, { reason: "존재하지 않는 사용자" });
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
          return done(null, user);
        }

        return done(null, false, { reason: "비밀번호가 틀립니다" });
      } catch (e) {
        console.error(e);
        return done(e);
      }
    }
  )
);
