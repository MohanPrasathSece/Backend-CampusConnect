import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { Role } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

export const authorize = (roles: Role[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!roles.includes(req.user!.role))
    return res.status(403).json({ message: 'Forbidden' });
  next();
};
