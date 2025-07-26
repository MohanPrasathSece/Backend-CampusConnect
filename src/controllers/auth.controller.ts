import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { Role } from '../models/User.js';

const SALT_ROUNDS = 10;

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email in use' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashed, role });
    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '7d'
    });
    res.status(201).json({ token, user: { id: user.id, name, email, role } });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '7d'
    });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};
