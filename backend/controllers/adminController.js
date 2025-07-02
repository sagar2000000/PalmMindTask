import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

const verifyAdmin = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      res.status(403).json({ error: "Forbidden: Admin only" });
      return false;
    }
    req.adminId = decoded.id; 
    return true;
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
    return false;
  }
};


export const getAllUsersWithMessageCount = async (req, res) => {
  if (!verifyAdmin(req, res)) return;

  try {
    const users = await User.find({}, { password: 0, __v: 0 }); 

    const usersWithMessageCount = await Promise.all(
      users.map(async (user) => {
        const count = await Message.countDocuments({
          $or: [{ sender: user._id }, { receiver: user._id }],
        });
        return { ...user.toObject(), messageCount: count };
      })
    );

    res.json(usersWithMessageCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateUsername = async (req, res) => {
  if (!verifyAdmin(req, res)) return;

  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username || username.trim() === "") {
      return res.status(400).json({ error: "Username is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const user = await User.findByIdAndUpdate(id, { username }, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Username updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteUserAndMessages = async (req, res) => {
  if (!verifyAdmin(req, res)) return;

  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await Message.deleteMany({ $or: [{ sender: id }, { receiver: id }] });

    res.json({ message: "User and their messages deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const adminCreateUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminUser = await User.findById(decoded.id);

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    await User.create({ username, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Admin create user error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

