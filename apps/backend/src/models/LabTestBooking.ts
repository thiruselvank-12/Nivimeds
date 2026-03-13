import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILabTestBooking extends Document {
  user: mongoose.Types.ObjectId;
  labTest: mongoose.Types.ObjectId;
  member: {
    name: string;
    relation: string;
    age: number;
    gender: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  date: Date;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const LabTestBookingSchema = new Schema<ILabTestBooking>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  labTest: { type: Schema.Types.ObjectId, ref: 'LabTest', required: true },
  member: {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
  },
  address: {
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  price: { type: Number, required: true }
}, { timestamps: true });

const LabTestBooking: Model<ILabTestBooking> = mongoose.models.LabTestBooking || mongoose.model<ILabTestBooking>('LabTestBooking', LabTestBookingSchema);

export default LabTestBooking;
