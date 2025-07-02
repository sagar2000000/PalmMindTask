import express from "express";
import {
  sendMessage,
  getMessages,
  getMessageSummary,
  countBetweenUsers,
  totalChats,
  getChatSummary
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/", sendMessage);
messageRouter.get("/:userId", getMessages);
messageRouter.get("/summary/:userId", getMessageSummary);
messageRouter.get("/count/:user1Id/:user2Id", countBetweenUsers);
messageRouter.get("/total", totalChats);
messageRouter.get("/summary/:userId", getChatSummary);

export default messageRouter;