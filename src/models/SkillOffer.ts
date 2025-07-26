import { Schema, model, Types } from 'mongoose';

export interface ISkillOffer {
  skill: string;
  description?: string;
  requiredSkill?: string;
  tutor: Types.ObjectId;
  availableSlots: { day: string; start: string; end: string }[]; // e.g., {day:'Mon',start:'14:00',end:'15:00'}
  createdAt?: Date;
}

const skillOfferSchema = new Schema<ISkillOffer>(
  {
    skill: { type: String, required: true, trim: true },
    description: { type: String },
    requiredSkill: { type: String },
    tutor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    availableSlots: [{
      day: { type: String, required: true },
      start: { type: String, required: true },
      end: { type: String, required: true },
    }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<ISkillOffer>('SkillOffer', skillOfferSchema);
