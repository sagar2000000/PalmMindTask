import express from "express";
import { searchUsers, updateUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", searchUsers);


userRouter.put("/:id/update", updateUser);

export default userRouter;
