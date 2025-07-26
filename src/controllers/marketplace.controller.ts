import { Request, Response } from 'express';
import MarketplaceItem from '../models/MarketplaceItem';

// GET /marketplace
export const listItems = async (_req: Request, res: Response) => {
  const items = await MarketplaceItem.find().sort({ createdAt: -1 });
  res.json(items);
};

// POST /marketplace
export const createItem = async (req: Request, res: Response) => {
  const { title, description, price, category, contact, days, image } = req.body;
  if(!title || !contact) return res.status(400).json({message:'Title and contact required'});
  const expiresAt = new Date(Date.now() + (Number(days)||7)*24*60*60*1000);
  const item = await MarketplaceItem.create({
    title,
    description,
    price: Number(price||0),
    category,
    image,
    contact,
    seller: req.user!.id,
    expiresAt,
  });
  res.status(201).json(item);
};

// DELETE /marketplace/:id (owner only)
// POST /marketplace/:id/interested
export const addInterest = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone required' });
  const item = await MarketplaceItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  if (item.seller.toString() === req.user!.id) return res.status(400).json({ message: 'Cannot mark interest on own item' });
  if (item.interests?.some((i: any) => i.user.toString() === req.user!.id)) {
    return res.status(400).json({ message: 'Already interested' });
  }
  item.interests.push({ user: req.user!.id as any, phone, createdAt: new Date() });
  await item.save();
  res.json({ message: 'Noted' });
};

// GET /marketplace/:id/interests (seller or admin)
export const acceptInterest = async (req: Request, res: Response) => {
  const { id, interestId } = req.params;
  const item = await MarketplaceItem.findById(id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  // @ts-ignore
  if (item.seller.toString() !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  // @ts-ignore
  const interest = (item.interests as any).id(interestId);
  if (!interest) return res.status(404).json({ message: 'Interest not found' });
  interest.accepted = true;
  await item.save();
  res.json({ message: 'Accepted' });
};

export const getInterests = async (req: Request, res: Response) => {
  const item = await MarketplaceItem.findById(req.params.id).populate('interests.user', 'name');
  if (!item) return res.status(404).json({ message: 'Not found' });
  // @ts-ignore
  if (item.seller.toString() !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(item.interests);
};

export const deleteItem = async (req: Request, res: Response) => {
  const item = await MarketplaceItem.findById(req.params.id);
  if(!item) return res.status(404).json({message:'Not found'});
  if(item.seller.toString()!==req.user!.id) return res.status(403).json({message:'Forbidden'});
  await item.deleteOne();
  res.json({message:'Deleted'});
};
