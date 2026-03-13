import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  consultationFee: number;
  image?: string;
  about?: string;
  languages: string[];
  availableDays: string[];
  availableTimeStart: string; // HH:mm
  availableTimeEnd: string; // HH:mm
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    qualifications: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    consultationFee: { type: Number, required: true },
    image: String,
    about: String,
    languages: { type: [String], default: [] },
    availableDays: { type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    availableTimeStart: { type: String, default: '09:00' },
    availableTimeEnd: { type: String, default: '17:00' },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Doctor: Model<IDoctor> =
  mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default Doctor;
