import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress {
  _id?: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email?: string;
  phone: string;
  passwordHash?: string;
  googleId?: string;
  role: 'user' | 'admin';
  avatar?: string;
  paybackPoints: number;
  membershipTier: 'none' | 'basic' | 'plus';
  membershipExpiry?: Date;
  addresses: IAddress[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: 'Home' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: String,
    googleId: { type: String, sparse: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: String,
    paybackPoints: { type: Number, default: 0 },
    membershipTier: { type: String, enum: ['none', 'basic', 'plus'], default: 'none' },
    membershipExpiry: Date,
    addresses: [AddressSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
