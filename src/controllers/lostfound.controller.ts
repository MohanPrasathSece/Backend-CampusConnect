import { Request, Response } from 'express';
import LostFound from '../models/LostFound.js';

export const reportItem = async (req: Request, res: Response) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const item = await LostFound.create({
      ...req.body,
      imageUrl,
      reporter: req.user!.id
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Report failed' });
  }
};

export const getItems = async (_: Request, res: Response) => {
  const list = await LostFound.find().sort({ createdAt: -1 }).populate('responses.finder', 'name email');
  res.json(list);
};

export const updateItem = async (req: Request, res: Response) => {
  const item = await LostFound.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(item);
};

export const addResponse = async (req: Request, res: Response) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    item.responses.push({ finder: req.user!.id as any, imageUrl, message: req.body.message, contact: req.body.contact, createdAt: new Date() });
    await item.save();
    res.json(item);
  } catch {
    res.status(500).json({ message: 'Failed' });
  }
};

export const closeItem = async (req: Request, res: Response) => {
  const item = await LostFound.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  if (req.user!.role !== 'admin' && item.reporter.toString() !== req.user!.id)
    return res.status(403).json({ message: 'Forbidden' });
  item.isResolved = true;
  await item.save();
  res.json(item);
};

export const deleteItem = async (req: Request, res: Response) => {
  await LostFound.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
