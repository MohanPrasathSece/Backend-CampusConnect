import { Request, Response } from 'express';
import SkillOffer from '../models/SkillOffer';
import SkillBooking from '../models/SkillBooking';

export const listOffers = async (_: Request, res: Response) => {
  const offers = await SkillOffer.find().populate('tutor', 'name');
  res.json(offers);
};

export const listBookings = async (req: Request, res: Response) => {
  const { id } = req.params; // offer id
  const bookings = await SkillBooking.find({ offer: id }).populate('student', 'name');
  res.json(bookings);
};

export const createOffer = async (req: Request, res: Response) => {
  const { skill, description, requiredSkill, availableSlots } = req.body;
  const slots = (availableSlots as any[]).filter((s)=> s && s.day && s.start && s.end);
  if(slots.length===0){
    return res.status(400).json({message:'Please provide at least one valid slot'});
  }
  const offer = await SkillOffer.create({
    skill,
    description,
    requiredSkill,
    availableSlots: slots,
    tutor: req.user!.id,
  });
  res.status(201).json(offer);
};

export const bookSlot = async (req: Request, res: Response) => {
  const { slot } = req.body;
  const offerId = req.params.id;
  const booking = await SkillBooking.create({
    offer: offerId,
    student: req.user!.id,
    slot,
  });
  res.status(201).json(booking);
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { status } = req.body; // 'accepted' | 'rejected'
  const booking = await SkillBooking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(booking);
};

export const deleteOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const offer = await SkillOffer.findById(id);
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  if (offer.tutor.toString() !== req.user!.id) {
    return res.status(403).json({ message: 'Not authorized to delete this offer' });
  }
  await offer.deleteOne();
  res.json({ success: true });
};

// List bookings (pending & accepted) for the logged-in student
export const getMyBookings = async (req: Request, res: Response) => {
  const bookings = await SkillBooking.find({ student: req.user!.id, status: { $in: ['pending', 'accepted'] } })
    .populate({ path: 'offer', populate: { path: 'tutor', select: 'name' } });
  res.json(bookings);
};

// List accepted bookings for the logged-in student
export const getMyAcceptedBookings = async (req: Request, res: Response) => {
  const bookings = await SkillBooking.find({ student: req.user!.id, status: 'accepted' })
    .populate({ path: 'offer', populate: { path: 'tutor', select: 'name' } });
  res.json(bookings);
};
