/**
 * Seed script — populates MongoDB with products, categories, lab tests, and coupons
 * Usage: npx ts-node --project tsconfig.json scripts/seedProducts.ts
 * Or via: node -e "require('./scripts/seedProducts')"
 *
 * Requires MONGODB_URI in .env.local
 */

import mongoose from 'mongoose';
import { PRODUCTS, CATEGORIES } from '../lib/mockData';

// Inline minimal models for seed script (avoids server-only imports)
const ProductSchema = new mongoose.Schema({
  name: String, slug: String, brand: String, manufacturer: String,
  category: String, subcategory: String, description: String,
  ingredients: [String], dosage: String, unit: String,
  price: Number, mrp: Number, images: [String], image: String,
  requiresPrescription: Boolean, isOTC: Boolean, isNivimedsExclusive: Boolean,
  inStock: Boolean, stockQuantity: Number, rating: Number, reviewCount: Number,
  tags: [String], isActive: { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.index({ name: 'text', brand: 'text', description: 'text' });
const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const CouponSchema = new mongoose.Schema({
  code: String, type: String, discount: Number,
  minOrder: Number, maxUses: Number, isActive: Boolean,
  description: String, expiresAt: Date,
}, { timestamps: true });
const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

const LabTestSchema = new mongoose.Schema({
  name: String, description: String, price: Number, mrp: Number,
  turnaround: String, sampleType: String, isPopular: Boolean,
  isPackage: Boolean, testCount: Number, isActive: Boolean, category: String,
}, { timestamps: true });
const LabTestModel = mongoose.models.LabTest || mongoose.model('LabTest', LabTestSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env.local');

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await ProductModel.deleteMany({});
  await CouponModel.deleteMany({});
  await LabTestModel.deleteMany({});
  console.log('🧹 Cleared existing data');

  // Seed products
  const productsToInsert = PRODUCTS.map((p: any) => ({
    ...p,
    slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-'),
    images: p.image ? [p.image] : [],
    stockQuantity: 100,
    isActive: true,
  }));

  await ProductModel.insertMany(productsToInsert);
  console.log(`✅ Seeded ${productsToInsert.length} products`);

  // Seed default coupons
  const coupons = [
    { code: 'NIVI10', type: 'percent', discount: 10, minOrder: 0, isActive: true, description: '10% off on all orders' },
    { code: 'FIRST20', type: 'percent', discount: 20, minOrder: 200, isActive: true, description: '20% off for first-time orders' },
    { code: 'FLAT50', type: 'flat', discount: 50, minOrder: 299, isActive: true, description: 'Flat ₹50 off on orders above ₹299' },
    { code: 'HEALTH15', type: 'percent', discount: 15, minOrder: 500, isActive: true, description: '15% off on orders above ₹500' },
    { code: 'NIVIMED25', type: 'percent', discount: 25, minOrder: 1000, isActive: true, description: '25% off on orders above ₹1000', maxUses: 100 },
  ];
  await CouponModel.insertMany(coupons);
  console.log(`✅ Seeded ${coupons.length} coupons`);

  // Seed lab tests
  const labTests = [
    { name: 'Complete Blood Count (CBC)', description: 'Full blood panel including WBC, RBC, hemoglobin, platelets', price: 299, mrp: 499, turnaround: '6-8 hours', sampleType: 'Blood', isPopular: true, isPackage: false, testCount: 18, isActive: true, category: 'Blood' },
    { name: 'Comprehensive Diabetes Panel', description: 'HbA1c, fasting glucose, insulin, and more', price: 799, mrp: 1299, turnaround: '12-24 hours', sampleType: 'Blood', isPopular: true, isPackage: true, testCount: 6, isActive: true, category: 'Diabetes' },
    { name: 'Thyroid Function Test (TFT)', description: 'TSH, T3, T4 — complete thyroid panel', price: 449, mrp: 699, turnaround: '6-8 hours', sampleType: 'Blood', isPopular: true, isPackage: false, testCount: 3, isActive: true, category: 'Thyroid' },
    { name: 'Lipid Profile', description: 'Total cholesterol, LDL, HDL, triglycerides', price: 349, mrp: 549, turnaround: '6-8 hours', sampleType: 'Blood', isPopular: false, isPackage: false, testCount: 5, isActive: true, category: 'Heart' },
    { name: 'Liver Function Test (LFT)', description: 'Complete liver enzymes and bilirubin', price: 399, mrp: 649, turnaround: '8-12 hours', sampleType: 'Blood', isPopular: false, isPackage: false, testCount: 8, isActive: true, category: 'Liver' },
    { name: 'Vitamin D & B12 Panel', description: 'Essential vitamin levels check', price: 699, mrp: 999, turnaround: '12-24 hours', sampleType: 'Blood', isPopular: true, isPackage: true, testCount: 2, isActive: true, category: 'Vitamins' },
    { name: 'Urine Routine & Microscopy', description: 'Complete urine analysis', price: 149, mrp: 249, turnaround: '4-6 hours', sampleType: 'Urine', isPopular: false, isPackage: false, testCount: 12, isActive: true, category: 'Urine' },
    { name: 'Annual Health Checkup (Basic)', description: 'CBC, LFT, KFT, lipid, thyroid, diabetes, urine', price: 1499, mrp: 2999, turnaround: '24 hours', sampleType: 'Blood + Urine', isPopular: true, isPackage: true, testCount: 55, isActive: true, category: 'Packages' },
  ];

  await LabTestModel.insertMany(labTests);
  console.log(`✅ Seeded ${labTests.length} lab tests`);

  await mongoose.disconnect();
  console.log('\n🎉 Database seeded successfully!');
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
