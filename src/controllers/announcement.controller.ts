import { Request, Response } from 'express';
import Announcement from '../models/Announcement.js';

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const ann = await Announcement.create({ ...req.body, imageUrl, author: req.user!.id });
    res.status(201).json(ann);
  } catch (err) {
    res.status(500).json({ message: 'Create failed' });
  }
};

export const getAnnouncements = async (_: Request, res: Response) => {
  const list = await Announcement.find()
    .sort({ createdAt: -1 })
    .populate({ path: 'author', select: 'name _id' });
  res.json(list);
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(ann);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const likeAnnouncement = async (req: Request, res: Response) => {
  const ann = await Announcement.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
  res.json(ann);
};

export const viewAnnouncement = async (req: Request, res: Response) => {
  const ann = await Announcement.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
  res.json(ann);
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
