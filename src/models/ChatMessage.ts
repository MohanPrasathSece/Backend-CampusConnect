import { Schema, model, Types } from 'mongoose';

export interface IChatMessage {
  room: string;
  user: Types.ObjectId;
  text: string;
  createdAt?: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  room: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default model<IChatMessage>('ChatMessage', chatMessageSchema);
