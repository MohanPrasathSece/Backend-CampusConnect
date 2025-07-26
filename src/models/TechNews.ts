import mongoose, { Schema, Document } from 'mongoose';
import { Role } from './User.js';

export interface TechNewsDoc extends Document {
  title: string;
  description: string;
  link?: string;
  imageUrl?: string;
  type: 'hackathon' | 'internship' | 'news' | 'other';
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

const techNewsSchema = new Schema<TechNewsDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    imageUrl: { type: String },
    type: { type: String, enum: ['hackathon', 'internship', 'news', 'other'], default: 'news' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<TechNewsDoc>('TechNews', techNewsSchema);
