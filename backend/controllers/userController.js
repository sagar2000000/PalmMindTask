import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const searchUsers = async (req, res) => {
  const { search } = req.query;
  try {
    const users = await User.find({
      username: { $regex: search, $options: "i" },
    }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateUser = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const userId = req.params.id;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Old password incorrect" });

    
    if (username) user.username = username;
    if (newPassword) user.password = newPassword; 

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
