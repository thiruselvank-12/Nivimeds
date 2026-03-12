import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILabTest extends Document {
  name: string;
  description?: string;
  price: number;
  mrp: number;
  turnaround: string;
  sampleType: string;
  isPopular: boolean;
  isPackage: boolean;
  testCount: number;
  isActive: boolean;
  category?: string;
  preparation?: string;
}

const LabTestSchema = new Schema<ILabTest>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    turnaround: { type: String, required: true },
    sampleType: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
    isPackage: { type: Boolean, default: false },
    testCount: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    category: String,
    preparation: String,
  },
  { timestamps: true }
);

const LabTest: Model<ILabTest> =
  mongoose.models.LabTest || mongoose.model<ILabTest>('LabTest', LabTestSchema);

export default LabTest;
