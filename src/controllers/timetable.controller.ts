import { Request, Response } from 'express';
import Timetable from '../models/Timetable.js';

export const upsertTimetable = async (req: Request, res: Response) => {
  const table = await Timetable.findOneAndUpdate(
    { student: req.user!.id },
    { slots: req.body.slots },
    { new: true, upsert: true }
  );
  res.json(table);
};

export const getTimetable = async (req: Request, res: Response) => {
  const table = await Timetable.findOne({ student: req.user!.id });
  res.json(table);
};
