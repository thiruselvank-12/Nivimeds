import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILabTest extends Document {
  name: string;
  type: 'test' | 'package';
  sampleType?: string;
  turnaround?: string;
  price: number;
  mrp: number;
  popular: boolean;
  testsIncluded?: number; // Only for packages
  createdAt: Date;
  updatedAt: Date;
}

const LabTestSchema = new Schema<ILabTest>({
  name: { type: String, required: true },
  type: { type: String, enum: ['test', 'package'], required: true },
  sampleType: { type: String },
  turnaround: { type: String },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  popular: { type: Boolean, default: false },
  testsIncluded: { type: Number },
}, { timestamps: true });

const LabTest: Model<ILabTest> = mongoose.models.LabTest || mongoose.model<ILabTest>('LabTest', LabTestSchema);

export default LabTest;
