import mongoose, { Schema, Document } from 'mongoose';

export interface ILostFound extends Document {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  location: string;
  reporter: mongoose.Types.ObjectId;
  responses: { finder: mongoose.Types.ObjectId; imageUrl: string; message: string; contact?: string; createdAt: Date }[];
  createdAt: Date;
  isResolved: boolean;
}

const LostFoundSchema = new Schema<ILostFound>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: String,
    category: { type: String, required: true },
    location: { type: String, required: true },
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isResolved: { type: Boolean, default: false },
    responses: [
      {
        finder: { type: Schema.Types.ObjectId, ref: 'User' },
        imageUrl: String,
        message: String,
        contact: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<ILostFound>('LostFound', LostFoundSchema);
