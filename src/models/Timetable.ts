import mongoose, { Schema, Document } from 'mongoose';

export interface ISlot {
  day: string; // Mon - Sun
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  subject: string;
}

export interface ITimetable extends Document {
  student: mongoose.Types.ObjectId;
  slots: ISlot[];
}

const TimetableSchema = new Schema<ITimetable>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slots: [
      {
        day: String,
        startTime: String,
        endTime: String,
        subject: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<ITimetable>('Timetable', TimetableSchema);
