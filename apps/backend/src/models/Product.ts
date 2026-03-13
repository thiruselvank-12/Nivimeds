import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  manufacturer?: string;
  category: string;
  subcategory?: string;
  description: string;
  ingredients?: string[];
  dosage?: string;
  unit?: string;
  price: number;
  mrp: number;
  images: string[];
  image?: string; // legacy/primary image shortcut
  requirePrescription: boolean;
  isOTC: boolean;
  isNivimedsExclusive?: boolean;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  supplierId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: String, required: true },
    manufacturer: String,
    category: { type: String, required: true },
    subcategory: String,
    description: { type: String, required: true },
    ingredients: [String],
    dosage: String,
    unit: String,
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    images: { type: [String], default: [] },
    image: String,
    requirePrescription: { type: Boolean, default: false },
    isOTC: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isNivimedsExclusive: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 100 },
    rating: { type: Number, default: 4.0 },
    reviewCount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  },
  { timestamps: true }
);

// Text search index
ProductSchema.index({
  name: 'text',
  brand: 'text',
  description: 'text',
  tags: 'text',
  category: 'text',
});

ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
