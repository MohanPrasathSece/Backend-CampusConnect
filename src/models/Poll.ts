import mongoose, { Schema, Document } from 'mongoose';

export interface PollOption {
  text: string;
  votes: number;
}

export interface PollDoc extends Document {
  question: string;
  options: PollOption[];
  createdBy: mongoose.Types.ObjectId;
  voters: mongoose.Types.ObjectId[]; // users who have voted (1 vote only)
  isActive: boolean;
  feedbacks: { user: mongoose.Types.ObjectId; text: string; createdAt: Date }[];
  changedOnce: mongoose.Types.ObjectId[];
  choices: Map<string, number>;
  createdAt: Date;
}

const optionSchema = new Schema<PollOption>({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const pollSchema = new Schema<PollDoc>(
  {
    question: { type: String, required: true },
    options: [optionSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    voters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    feedbacks: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, text: String, createdAt: { type: Date, default: Date.now } }],
    changedOnce: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    choices: { type: Map, of: Number },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<PollDoc>('Poll', pollSchema);
