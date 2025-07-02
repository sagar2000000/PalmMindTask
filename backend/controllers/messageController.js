import Message from "../models/Message.js";

import User from "../models/User.js";
import mongoose from "mongoose";

export const getChatSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
              "$receiver",
              "$sender",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$otherUser",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          user: { _id: "$user._id", username: "$user.username" },
          count: 1,
        },
      },
    ]);

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentUserId } = req.query;
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMessageSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
              "$receiver",
              "$sender"
            ]
          },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          user: { _id: "$user._id", username: "$user.username" },
          count: 1
        }
      }
    ]);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const countBetweenUsers = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;
    const chatCount = await Message.countDocuments({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id }
      ]
    });
    res.json({ chatCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const totalChats = async (req, res) => {
  try {
    const totalChats = await Message.countDocuments();
    res.json({ totalChats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};