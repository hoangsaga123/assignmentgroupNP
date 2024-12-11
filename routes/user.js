import express from 'express';
import * as user from '../controllers/user.js';
import authorise from '../middleware/userMiddelware.js';

export const userRouter = express.Router();

userRouter.get("/login-form", user.loginForm);
userRouter.post("/login-form/submit", user.login);
userRouter.get("/registration", user.registrationForm);
userRouter.post("/registration/submit", user.registration);
userRouter.get("/profile", authorise(['user']), user.displayProfile);
userRouter.get("/logout", user.logout);