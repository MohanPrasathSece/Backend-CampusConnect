import { Request, Response } from 'express';
import Poll from '../models/Poll.js';

export const getPolls = async (_: Request, res: Response) => {
  const polls = await Poll.find().sort({ createdAt: -1 });
  res.json(polls);
};

export const createPoll = async (req: Request, res: Response) => {
  try {
    const { question, options } = req.body; // options: string[]
    const poll = await Poll.create({
      question,
      options: options.map((t: string) => ({ text: t, votes: 0 })),
      createdBy: req.user!.id,
    });
    res.status(201).json(poll);
  } catch {
    res.status(500).json({ message: 'Create failed' });
  }
};

export const deletePoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ message: 'Not found' });
    // @ts-ignore
    if (poll.createdBy.toString() !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await poll.deleteOne();
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Delete failed' });
  }
};

export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ message: 'Not found' });
    poll.feedbacks.push({ user: req.user!.id as any, text, createdAt: new Date() });
    await poll.save();
    res.json({ message: 'Added' });
  } catch {
    res.status(500).json({ message: 'Feedback failed' });
  }
};

export const votePoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;
    const poll = await Poll.findById(id);
    if (!poll || !poll.isActive) return res.status(404).json({ message: 'Poll not found' });
    const userId = req.user!.id as string;
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid option' });
    }

    if (!poll.choices) poll.choices = new Map();
    const prevChoice = poll.choices.get(userId);

    if (prevChoice === undefined) {
      // first time voting
      poll.options[optionIndex].votes += 1;
      poll.voters.push(userId as any);
      poll.choices.set(userId, optionIndex);
    } else {
      // user wants to change vote
      if (poll.changedOnce.includes(userId as any)) {
        return res.status(400).json({ message: 'You have already changed your vote once' });
      }
      if (prevChoice === optionIndex) {
        return res.status(400).json({ message: 'You already selected this option' });
      }
      poll.options[prevChoice].votes -= 1;
      poll.options[optionIndex].votes += 1;
      poll.changedOnce.push(userId as any);
      poll.choices.set(userId, optionIndex);
    }

    await poll.save();
    res.json(poll);
  } catch {
    res.status(500).json({ message: 'Vote failed' });
  }
};
