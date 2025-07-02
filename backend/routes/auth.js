import express from "express";
import { register, login, me } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get('/me', me);
export default authRouter;