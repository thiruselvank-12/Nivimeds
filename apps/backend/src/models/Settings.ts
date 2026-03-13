import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  taxRate: number; // e.g. 5 for 5%
  freeDeliveryThreshold: number;
  flatDeliveryFee: number;
  supportHours: string;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, default: 'Nivimeds' },
    contactEmail: { type: String, default: 'support@nivimeds.com' },
    contactPhone: { type: String, default: '+91 1800-123-4567' },
    address: { type: String, default: '123 Health Ave, Medical District' },
    taxRate: { type: Number, default: 18.0 },
    freeDeliveryThreshold: { type: Number, default: 500 },
    flatDeliveryFee: { type: Number, default: 50 },
    supportHours: { type: String, default: 'Mon-Sun: 9:00 AM - 9:00 PM' },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
