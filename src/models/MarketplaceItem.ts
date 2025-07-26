import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketplaceItem extends Document {
  title: string;
  description: string;
  price: number; // 0 means free / donate
  category: 'books' | 'equipment' | 'other';
  contact: string; // email / phone
  seller: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const MarketplaceItemSchema = new Schema<IMarketplaceItem>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, enum: ['books', 'equipment', 'other'], default: 'other' },
    contact: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Auto-delete document after expiry
MarketplaceItemSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IMarketplaceItem>('MarketplaceItem', MarketplaceItemSchema);
