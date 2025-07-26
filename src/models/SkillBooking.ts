import { Schema, model, Types } from 'mongoose';

export interface ISkillBooking {
  offer: Types.ObjectId;
  student: Types.ObjectId;
  slot: { day: string; start: string; end: string };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: Date;
}

const skillBookingSchema = new Schema<ISkillBooking>(
  {
    offer: { type: Schema.Types.ObjectId, ref: 'SkillOffer', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slot: {
      day: { type: String, required: true },
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<ISkillBooking>('SkillBooking', skillBookingSchema);
