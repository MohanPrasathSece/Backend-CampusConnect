import mongoose, { Schema, Document } from 'mongoose';

export enum ComplaintStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Resolved = 'Resolved'
}

export interface IComplaint extends Document {
  category: string;
  description: string;
  status: ComplaintStatus;
  student: mongoose.Types.ObjectId;
  history: { status: ComplaintStatus; date: Date }[];
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ComplaintStatus),
      default: ComplaintStatus.Pending
    },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    history: [
      {
        status: { type: String, enum: Object.values(ComplaintStatus) },
        date: Date
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IComplaint>('Complaint', ComplaintSchema);
