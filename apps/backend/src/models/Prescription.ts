import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPrescription extends Document {
  userId: mongoose.Types.ObjectId;
  fileUrl: string;
  publicId: string;
  fileType: 'image' | 'pdf';
  notes?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: { type: String, enum: ['image', 'pdf'], required: true },
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: String,
    reviewedAt: Date,
  },
  { timestamps: true }
);

PrescriptionSchema.index({ userId: 1, createdAt: -1 });

const Prescription: Model<IPrescription> =
  mongoose.models.Prescription ||
  mongoose.model<IPrescription>('Prescription', PrescriptionSchema);

export default Prescription;
