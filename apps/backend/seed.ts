/**
 * Nivimeds Database Seeder
 * Run: npx ts-node seed.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// ─── Import models ────────────────────────────────────
import Product from './src/models/Product';
import Category from './src/models/Category';
import User from './src/models/User';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nivimeds';

const CATEGORIES = [
  { name: 'Medicines', slug: 'medicines', description: 'Prescription and OTC medicines' },
  { name: 'Vitamins & Supplements', slug: 'vitamins-supplements', description: 'Health supplements and vitamins' },
  { name: 'Personal Care', slug: 'personal-care', description: 'Personal hygiene and skincare' },
  { name: 'Healthcare Devices', slug: 'healthcare-devices', description: 'Medical equipment and devices' },
  { name: 'Baby Care', slug: 'baby-care', description: 'Products for babies and infants' },
  { name: 'Diabetic Care', slug: 'diabetic-care', description: 'Diabetes management products' },
];

const PRODUCTS = [
  { name: 'Paracetamol 500mg', slug: 'paracetamol-500mg', brand: 'Calpol', manufacturer: 'GSK Pharma', category: 'Medicines', description: 'Effective relief from fever and mild to moderate pain.', price: 22, mrp: 28, stockQuantity: 500, rating: 4.6, requirePrescription: false, isOTC: true, tags: ['fever', 'painkiller', 'paracetamol'], unit: '15 tablets' },
  { name: 'Azithromycin 500mg', slug: 'azithromycin-500mg', brand: 'Azithral', manufacturer: 'Alembic Pharma', category: 'Medicines', description: 'Broad-spectrum antibiotic for bacterial infections.', price: 145, mrp: 175, stockQuantity: 200, rating: 4.4, requirePrescription: true, isOTC: false, tags: ['antibiotic', 'azithromycin'], unit: '3 tablets' },
  { name: 'Omeprazole 20mg', slug: 'omeprazole-20mg', brand: 'Omez', manufacturer: 'Dr. Reddys', category: 'Medicines', description: 'Proton pump inhibitor for acidity and GERD treatment.', price: 65, mrp: 82, stockQuantity: 350, rating: 4.5, requirePrescription: false, isOTC: true, tags: ['acidity', 'omeprazole', 'antacid'], unit: '10 capsules' },
  { name: 'Metformin 500mg', slug: 'metformin-500mg', brand: 'Glycomet', manufacturer: 'USV Ltd', category: 'Diabetic Care', description: 'First-line medication for type 2 diabetes management.', price: 35, mrp: 45, stockQuantity: 800, rating: 4.7, requirePrescription: true, isOTC: false, tags: ['diabetes', 'metformin', 'sugar'], unit: '10 tablets' },
  { name: 'Cetirizine 10mg', slug: 'cetirizine-10mg', brand: 'Zyrtec', manufacturer: 'UCB India', category: 'Medicines', description: 'Non-drowsy antihistamine for allergy and cold relief.', price: 28, mrp: 35, stockQuantity: 600, rating: 4.3, requirePrescription: false, isOTC: true, tags: ['allergy', 'antihistamine', 'cold'], unit: '10 tablets' },
  { name: 'Vitamin D3 60000 IU', slug: 'vitamin-d3-60000iu', brand: 'Calcirol', manufacturer: 'Cadila Health', category: 'Vitamins & Supplements', description: 'Vitamin D3 supplement for bone health and immunity.', price: 58, mrp: 72, stockQuantity: 450, rating: 4.8, requirePrescription: false, isOTC: true, tags: ['vitamin D', 'bones', 'immunity'], unit: '4 sachets' },
  { name: 'Multivitamin Tablets', slug: 'multivitamin-tablets', brand: 'Supradyn', manufacturer: 'Bayer', category: 'Vitamins & Supplements', description: 'Complete daily multivitamin with 12 vitamins and 5 minerals.', price: 189, mrp: 240, stockQuantity: 320, rating: 4.5, requirePrescription: false, isOTC: true, tags: ['multivitamin', 'energy', 'health'], unit: '30 tablets' },
  { name: 'Omega-3 Fish Oil 1000mg', slug: 'omega3-fish-oil', brand: 'Myprotein', manufacturer: 'Myprotein India', category: 'Vitamins & Supplements', description: 'High-potency fish oil for heart and brain health.', price: 349, mrp: 450, stockQuantity: 180, rating: 4.6, requirePrescription: false, isOTC: true, tags: ['omega3', 'heart', 'fish oil'], unit: '60 softgels' },
  { name: 'Blood Pressure Monitor', slug: 'bp-monitor-digital', brand: 'Omron', manufacturer: 'Omron Healthcare', category: 'Healthcare Devices', description: 'Accurate digital BP monitor for home use.', price: 1499, mrp: 1999, stockQuantity: 60, rating: 4.8, requirePrescription: false, isOTC: true, tags: ['bp', 'blood pressure', 'monitor', 'omron'], unit: '1 device' },
  { name: 'Glucometer Starter Kit', slug: 'glucometer-starter-kit', brand: 'Accu-Chek', manufacturer: 'Roche Diagnostics', category: 'Diabetic Care', description: 'Easy-to-use blood glucose monitoring system.', price: 999, mrp: 1450, stockQuantity: 75, rating: 4.7, requirePrescription: false, isOTC: true, tags: ['glucometer', 'diabetes', 'blood sugar'], unit: '1 kit + 10 strips' },
  { name: 'Amoxicillin 500mg', slug: 'amoxicillin-500mg', brand: 'Mox', manufacturer: 'Ranbaxy', category: 'Medicines', description: 'Penicillin-type antibiotic for bacterial infections.', price: 95, mrp: 120, stockQuantity: 290, rating: 4.2, requirePrescription: true, isOTC: false, tags: ['antibiotic', 'amoxicillin'], unit: '10 capsules' },
  { name: 'Pantoprazole 40mg', slug: 'pantoprazole-40mg', brand: 'Pan-D', manufacturer: 'Alkem Labs', category: 'Medicines', description: 'Treats GERD, peptic ulcers, and Zollinger-Ellison syndrome.', price: 78, mrp: 98, stockQuantity: 420, rating: 4.4, requirePrescription: false, isOTC: true, tags: ['acidity', 'ulcer', 'pantoprazole'], unit: '10 tablets' },
  { name: 'Baby Diaper Rash Cream', slug: 'baby-diaper-rash-cream', brand: 'Himalaya', manufacturer: 'Himalaya Drug Co', category: 'Baby Care', description: 'Gentle soothing cream for baby diaper rash.', price: 130, mrp: 165, stockQuantity: 240, rating: 4.6, requirePrescription: false, isOTC: true, tags: ['baby', 'diaper', 'rash', 'cream'], unit: '50g tube' },
  { name: 'Hand Sanitizer 500ml', slug: 'hand-sanitizer-500ml', brand: 'Dettol', manufacturer: 'Reckitt', category: 'Personal Care', description: '70% alcohol-based hand sanitizer, kills 99.9% germs.', price: 185, mrp: 220, stockQuantity: 700, rating: 4.3, requirePrescription: false, isOTC: true, tags: ['sanitizer', 'hygiene', 'dettol'], unit: '500ml bottle' },
  { name: 'N95 Face Mask', slug: 'n95-face-mask', brand: '3M', manufacturer: '3M India', category: 'Personal Care', description: 'NIOSH approved N95 respirator for airborne particle filtration.', price: 89, mrp: 120, stockQuantity: 1000, rating: 4.7, requirePrescription: false, isOTC: true, tags: ['mask', 'n95', 'protection', '3m'], unit: '1 mask' },
  { name: 'Ibuprofen 400mg', slug: 'ibuprofen-400mg', brand: 'Brufen', manufacturer: 'Abbott India', category: 'Medicines', description: 'NSAID for pain relief, fever, and inflammation.', price: 32, mrp: 40, stockQuantity: 550, rating: 4.3, requirePrescription: false, isOTC: true, tags: ['painkiller', 'ibuprofen', 'fever', 'inflammation'], unit: '10 tablets' },
  { name: 'Iron + Folic Acid Tablets', slug: 'iron-folic-acid', brand: 'Sherferrol', manufacturer: 'Entod Pharma', category: 'Vitamins & Supplements', description: 'Iron and Folic Acid supplement for anaemia prevention.', price: 55, mrp: 70, stockQuantity: 380, rating: 4.4, requirePrescription: false, isOTC: true, tags: ['iron', 'folic acid', 'anaemia', 'haemoglobin'], unit: '30 tablets' },
  { name: 'Betadine Antiseptic Liquid', slug: 'betadine-antiseptic', brand: 'Betadine', manufacturer: 'Win-Medicare', category: 'Personal Care', description: 'Povidone-iodine antiseptic for wound cleaning and disinfection.', price: 85, mrp: 110, stockQuantity: 310, rating: 4.5, requirePrescription: false, isOTC: true, tags: ['antiseptic', 'wound', 'betadine', 'iodine'], unit: '100ml' },
  { name: 'Thermometer Digital', slug: 'digital-thermometer', brand: 'Dr. Morepen', manufacturer: 'Morepen Labs', category: 'Healthcare Devices', description: 'Fast and accurate digital thermometer for body temperature.', price: 149, mrp: 220, stockQuantity: 200, rating: 4.6, requirePrescription: false, isOTC: true, tags: ['thermometer', 'fever', 'temperature'], unit: '1 device' },
  { name: 'Calcium Carbonate 500mg', slug: 'calcium-carbonate-500mg', brand: 'Shelcal', manufacturer: 'Elder Pharma', category: 'Vitamins & Supplements', description: 'Calcium supplement for bone strength and osteoporosis prevention.', price: 95, mrp: 125, stockQuantity: 290, rating: 4.4, requirePrescription: false, isOTC: true, tags: ['calcium', 'bones', 'osteoporosis'], unit: '30 tablets' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products and categories');

    // Seed categories
    const categories = await Category.insertMany(CATEGORIES);
    console.log(`✅ Seeded ${categories.length} categories`);

    // Seed products
    const products = await Product.insertMany(PRODUCTS);
    console.log(`✅ Seeded ${products.length} products`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ phone: '9999999999' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        phone: '9999999999',
        email: 'admin@nivimeds.com',
        role: 'admin',
      });
      console.log('✅ Created admin user (phone: 9999999999, OTP: 123456)');
    }

    console.log('\n🎉 Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
