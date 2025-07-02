import User from "../models/User.js";
import jwt from "jsonwebtoken";


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

export const me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const user = await User.create({ username, password });

    const safeUser = await User.findById(user._id).select('-password');


    const token = generateToken(safeUser);
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const safeUser = await User.findById(user._id).select('-password');

    
    const token = generateToken(safeUser);
    res.status(200).json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
