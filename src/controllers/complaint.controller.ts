import { Request, Response } from 'express';
import Complaint, { ComplaintStatus } from '../models/Complaint.js';

export const createComplaint = async (req: Request, res: Response) => {
  const complaint = await Complaint.create({
    ...req.body,
    student: req.user!.id,
    history: [{ status: ComplaintStatus.Pending, date: new Date() }]
  });
  res.status(201).json(complaint);
};

export const getComplaints = async (_req: Request, res: Response) => {
  const list = await Complaint.find();
  res.json(list);
};

export const updateStatus = async (req: Request, res: Response) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Not found' });
  complaint.status = req.body.status;
  complaint.history.push({ status: req.body.status, date: new Date() });
  await complaint.save();
  res.json(complaint);
};

export const deleteComplaint = async (req: Request, res: Response) => {
  await Complaint.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
