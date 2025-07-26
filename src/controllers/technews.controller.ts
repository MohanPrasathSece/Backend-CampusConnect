import { Request, Response } from 'express';
import TechNews from '../models/TechNews.js';

export const getTechNews = async (_: Request, res: Response) => {
  const news = await TechNews.find().sort({ createdAt: -1 });
  res.json(news);
};

export const createTechNews = async (req: Request, res: Response) => {
  try {
        const { title, description, link, type } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const news = await TechNews.create({
      title,
      description,
      link,
      type,
      imageUrl,
      author: req.user!.id,
    });
    res.status(201).json(news);
  } catch {
    res.status(500).json({ message: 'Create failed' });
  }
};

export const deleteTechNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const news = await TechNews.findById(id);
    if (!news) return res.status(404).json({ message: 'Not found' });

    // @ts-ignore
    if (news.author.toString() !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await news.deleteOne();
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Delete failed' });
  }
};
