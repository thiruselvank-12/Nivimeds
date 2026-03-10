// Central mock data for the entire Nivimeds platform
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  mrp: number;
  image: string;
  requiresPrescription: boolean;
  isOTC: boolean;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  description: string;
  ingredients?: string[];
  dosage?: string;
  unit?: string;
  isNivimedsExclusive?: boolean;
  tags?: string[];
}

export const PRODUCTS: Product[] = [
  // --- Nivimeds Exclusive ---
  {
    id: 'niv-001', slug: 'nivimeds-headache-relief-balm',
    name: 'Nivimeds Headache Relief Balm', brand: 'Nivimeds',
    category: 'Nivimeds Exclusive', subcategory: 'Pain Relief',
    price: 349, mrp: 499, image: '/assets/products/nivimeds_headache_relief_balm.png',
    requiresPrescription: false, isOTC: true, rating: 4.8, reviewCount: 342,
    inStock: true, isNivimedsExclusive: true,
    description: 'Premium ayurvedic balm with Shea Butter, Menthol & Camphor for instant headache relief.',
    ingredients: ['Shea Butter', 'Menthol', 'Camphor', 'Peppermint Oil', 'Eucalyptus Extract'],
    dosage: 'Apply gently on temples and forehead. Use 2-3 times daily.', unit: '25g',
    tags: ['topical', 'ayurvedic', 'headache'],
  },
  {
    id: 'niv-002', slug: 'nivimeds-stress-relief-roll-on',
    name: 'Nivimeds Stress Relief Roll-On', brand: 'Nivimeds',
    category: 'Nivimeds Exclusive', subcategory: 'Wellness',
    price: 450, mrp: 600, image: '/assets/products/nivimeds_stress_relief_roll-on.png',
    requiresPrescription: false, isOTC: true, rating: 4.9, reviewCount: 218,
    inStock: true, isNivimedsExclusive: true,
    description: 'Premium amber glass bottle with silver roller. Contains Lavender & Chamomile oil blend.',
    ingredients: ['Lavender Oil', 'Chamomile Oil', 'Bergamot', 'Jojoba Oil', 'Vitamin E'],
    dosage: 'Roll on wrists, temples, and behind ears. Breathe deeply.', unit: '10ml',
    tags: ['aromatherapy', 'stress', 'roll-on'],
  },
  {
    id: 'niv-003', slug: 'nivimeds-ortho-pain-relief-roll-on',
    name: 'Nivimeds Ortho Pain Relief Roll-On', brand: 'Nivimeds',
    category: 'Nivimeds Exclusive', subcategory: 'Pain Relief',
    price: 899, mrp: 1200, image: '/assets/products/nivimeds_ortho_pain_relief_roll-On.png',
    requiresPrescription: false, isOTC: true, rating: 4.6, reviewCount: 189,
    inStock: true, isNivimedsExclusive: true,
    description: 'White herbal liquid formula with 12 ayurvedic herbs for joint & muscle pain.',
    ingredients: ['Nilgiri Oil', 'Gandhapura Oil', 'Turpentine Oil', 'Camphor', 'Menthol', 'Gaultheria Oil'],
    dosage: 'Apply on affected area and massage gently. Use 3 times daily.', unit: '50ml',
    tags: ['joint pain', 'ayurvedic', 'roll-on', 'ortho'],
  },
  {
    id: 'niv-004', slug: 'nivimeds-herbal-inhaler',
    name: 'Nivimeds Herbal Inhaler', brand: 'Nivimeds',
    category: 'Nivimeds Exclusive', subcategory: 'Respiratory',
    price: 599, mrp: 899, image: '/assets/products/nivimeds_herbal_Inhaler.png',
    requiresPrescription: false, isOTC: true, rating: 4.7, reviewCount: 156,
    inStock: true, isNivimedsExclusive: true,
    description: 'Natural Menthol & Eucalyptus inhaler for instant nasal congestion relief.',
    ingredients: ['Menthol', 'Eucalyptus Oil', 'Camphor', 'Clove Oil', 'Thymol'],
    dosage: 'Insert into nostril and inhale gently. Use as needed.', unit: '1 piece',
    tags: ['inhaler', 'nasal', 'eucalyptus', 'menthol'],
  },
  {
    id: 'niv-005', slug: 'nivimeds-herbal-mouth-mist',
    name: 'Nivimeds Herbal Mouth Mist', brand: 'Nivimeds',
    category: 'Nivimeds Exclusive', subcategory: 'Oral Care',
    price: 750, mrp: 950, image: '/assets/products/nivimeds_herbal_mouth_mist.png',
    requiresPrescription: false, isOTC: true, rating: 4.5, reviewCount: 203,
    inStock: true, isNivimedsExclusive: true,
    description: 'Transparent spray bottle with Cranberry, Betel Leaves, Paneer Doda & Clove flavors.',
    ingredients: ['Cranberry Extract', 'Betel Leaf Extract', 'Clove Oil', 'Mint', 'Paneer Doda'],
    dosage: '2-3 sprays directly into mouth. Swirl and spit or swallow.', unit: '30ml',
    tags: ['oral care', 'mouth freshener', 'spray'],
  },
  // --- OTC Medicines ---
  {
    id: 'med-001', slug: 'dolo-650',
    name: 'Dolo 650mg Tablet', brand: 'Micro Labs',
    category: 'Medicines', subcategory: 'Pain Relief',
    price: 30, mrp: 35, image: '/assets/products/medicine_placeholder.svg',
    requiresPrescription: false, isOTC: true, rating: 4.7, reviewCount: 5241,
    inStock: true, description: 'Paracetamol 650mg for fever and mild to moderate pain.',
    ingredients: ['Paracetamol 650mg'], unit: '15 tablets', tags: ['fever', 'pain', 'otc'],
  },
  {
    id: 'med-002', slug: 'crocin-advance-500mg',
    name: 'Crocin Advance 500mg', brand: 'GSK',
    category: 'Medicines', subcategory: 'Pain Relief',
    price: 38, mrp: 42, image: '/assets/products/medicine_placeholder.svg',
    requiresPrescription: false, isOTC: true, rating: 4.6, reviewCount: 3821,
    inStock: true, description: 'Paracetamol 500mg for headache, fever and body pain.',
    ingredients: ['Paracetamol 500mg'], unit: '20 tablets', tags: ['fever', 'headache', 'otc'],
  },
  {
    id: 'med-003', slug: 'cetirizine-10mg',
    name: 'Cetirizine 10mg Tablet', brand: 'Elder Pharma',
    category: 'Medicines', subcategory: 'Allergy',
    price: 22, mrp: 28, image: '/assets/products/medicine_placeholder.svg',
    requiresPrescription: false, isOTC: true, rating: 4.5, reviewCount: 1932,
    inStock: true, description: 'Antihistamine for allergies, hay fever and hives.',
    ingredients: ['Cetirizine HCl 10mg'], unit: '10 tablets', tags: ['allergy', 'antihistamine'],
  },
  {
    id: 'med-004', slug: 'pantoprazole-40mg',
    name: 'Pantoprazole 40mg', brand: 'Sun Pharma',
    category: 'Medicines', subcategory: 'Gastro',
    price: 55, mrp: 70, image: '/assets/products/medicine_placeholder.svg',
    requiresPrescription: true, isOTC: false, rating: 4.4, reviewCount: 2134,
    inStock: true, description: 'Proton pump inhibitor for acid reflux and GERD.',
    ingredients: ['Pantoprazole 40mg'], unit: '10 tablets', tags: ['gastro', 'acid reflux', 'rx'],
  },
  {
    id: 'med-005', slug: 'metformin-500mg',
    name: 'Metformin 500mg Tablet', brand: 'USV',
    category: 'Medicines', subcategory: 'Diabetes',
    price: 48, mrp: 60, image: '/assets/products/medicine_placeholder.svg',
    requiresPrescription: true, isOTC: false, rating: 4.6, reviewCount: 3210,
    inStock: true, description: 'First-line medication for Type 2 Diabetes management.',
    ingredients: ['Metformin HCl 500mg'], unit: '20 tablets', tags: ['diabetes', 'rx'],
  },
  {
    id: 'med-006', slug: 'azithromycin-500mg',
    name: 'Azithromycin 500mg', brand: 'Cipla',
    category: 'Medicines', subcategory: 'Antibiotics',
    price: 110, mrp: 145, image: '/assets/products/medicine_placeholder.svg',
    requiresPrescription: true, isOTC: false, rating: 4.3, reviewCount: 876,
    inStock: true, description: 'Broad-spectrum antibiotic for bacterial infections.',
    ingredients: ['Azithromycin 500mg'], unit: '5 tablets', tags: ['antibiotic', 'rx'],
  },
  // --- Healthcare Products ---
  {
    id: 'hc-001', slug: 'omron-bp-monitor',
    name: 'Omron HEM-8712 BP Monitor', brand: 'Omron',
    category: 'Healthcare Devices', subcategory: 'Monitoring',
    price: 1899, mrp: 2499, image: '/assets/products/medicine_placeholder.svg',
    requiresPrescription: false, isOTC: true, rating: 4.7, reviewCount: 4123,
    inStock: true, description: 'Digital automatic blood pressure monitor with memory.',
    unit: '1 device', tags: ['bp', 'monitor', 'device'],
  },
  {
    id: 'hc-002', slug: 'glucometer-free-style',
    name: 'FreeStyle Lite Glucometer Kit', brand: 'Abbott',
    category: 'Healthcare Devices', subcategory: 'Diabetes',
    price: 1299, mrp: 1799, image: '/assets/products/medicine_placeholder.svg',
    requiresPrescription: false, isOTC: true, rating: 4.5, reviewCount: 2987,
    inStock: true, description: 'Blood glucose monitoring system with 10 free strips.',
    unit: '1 kit', tags: ['glucometer', 'diabetes', 'device'],
  },
];

export const CATEGORIES = [
  { id: 'medicines', name: 'Medicines', icon: 'Pill', color: 'blue' },
  { id: 'healthcare-devices', name: 'Healthcare Devices', icon: 'Activity', color: 'blue' },
  { id: 'skin-care', name: 'Skin Care', icon: 'Star', color: 'blue' },
  { id: 'baby-care', name: 'Baby Care', icon: 'Baby', color: 'blue' },
  { id: 'diabetes-care', name: 'Diabetes Care', icon: 'HeartPulse', color: 'blue' },
  { id: 'ayurvedic', name: 'Ayurvedic', icon: 'Leaf', color: 'blue' },
  { id: 'vitamins', name: 'Vitamins & Supps', icon: 'ShieldPlus', color: 'blue' },
  { id: 'personal-care', name: 'Personal Care', icon: 'Heart', color: 'blue' },
];

export const DOCTORS = [
  {
    id: 'doc-001', name: 'Dr. Priya Sharma', specialization: 'General Physician',
    experience: 12, rating: 4.8, reviewCount: 1243, fee: 299, available: true,
    image: '/assets/doctors/doctor_placeholder.svg', languages: ['English', 'Hindi', 'Tamil'],
    education: 'MBBS, MD - General Medicine', hospital: 'Apollo Hospitals',
  },
  {
    id: 'doc-002', name: 'Dr. Rajan Mehta', specialization: 'Cardiologist',
    experience: 18, rating: 4.9, reviewCount: 892, fee: 599, available: true,
    image: '/assets/doctors/doctor_placeholder.svg', languages: ['English', 'Hindi', 'Gujarati'],
    education: 'MBBS, MD - Cardiology, DM', hospital: 'Fortis Hearts',
  },
  {
    id: 'doc-003', name: 'Dr. Anitha Rao', specialization: 'Dermatologist',
    experience: 9, rating: 4.7, reviewCount: 2341, fee: 399, available: false,
    image: '/assets/doctors/doctor_placeholder.svg', languages: ['English', 'Telugu', 'Kannada'],
    education: 'MBBS, MD - Dermatology', hospital: 'Kaya Skin Clinic',
  },
  {
    id: 'doc-004', name: 'Dr. Suresh Nair', specialization: 'Diabetologist',
    experience: 15, rating: 4.6, reviewCount: 1567, fee: 499, available: true,
    image: '/assets/doctors/doctor_placeholder.svg', languages: ['English', 'Malayalam', 'Tamil'],
    education: 'MBBS, MD - Endocrinology', hospital: 'VHS Hospital',
  },
];

export const LAB_TESTS = [
  { id: 'lt-001', name: 'Complete Blood Count (CBC)', price: 299, mrp: 450, turnaround: '6 hours', sampleType: 'Blood', popular: true },
  { id: 'lt-002', name: 'Lipid Profile', price: 399, mrp: 600, turnaround: '12 hours', sampleType: 'Blood', popular: true },
  { id: 'lt-003', name: 'HbA1c (Diabetes Test)', price: 449, mrp: 650, turnaround: '6 hours', sampleType: 'Blood', popular: true },
  { id: 'lt-004', name: 'Thyroid Profile (T3, T4, TSH)', price: 599, mrp: 900, turnaround: '12 hours', sampleType: 'Blood', popular: false },
  { id: 'lt-005', name: 'Liver Function Test (LFT)', price: 499, mrp: 750, turnaround: '12 hours', sampleType: 'Blood', popular: false },
  { id: 'lt-006', name: 'Vitamin D (25-OH)', price: 799, mrp: 1200, turnaround: '24 hours', sampleType: 'Blood', popular: true },
  { id: 'lt-007', name: 'Urine Routine & Microscopy', price: 149, mrp: 220, turnaround: '4 hours', sampleType: 'Urine', popular: false },
  { id: 'lt-008', name: 'COVID-19 RT-PCR', price: 499, mrp: 800, turnaround: '24 hours', sampleType: 'Nasal Swab', popular: false },
];

export const HEALTH_PACKAGES = [
  { id: 'pkg-001', name: 'Nivimeds Full Body Checkup', tests: 78, price: 1499, mrp: 4500, popular: true },
  { id: 'pkg-002', name: 'Diabetes Care Package', tests: 12, price: 799, mrp: 1800, popular: true },
  { id: 'pkg-003', name: 'Heart Health Package', tests: 15, price: 999, mrp: 2800, popular: false },
  { id: 'pkg-004', name: "Women's Wellness Package", tests: 35, price: 1199, mrp: 3200, popular: true },
];

export const BLOG_POSTS = [
  {
    id: 'blog-001', slug: 'understanding-diabetes-complete-guide',
    title: 'Understanding Diabetes: A Complete Guide to Managing Sugar Levels',
    category: 'Diabetes Care', author: 'Dr. Priya Sharma', date: '2026-02-28',
    readTime: '5 min', excerpt: 'Managing diabetes involves lifestyle changes, medication, and regular monitoring. Here is everything you need to know.',
    tags: ['diabetes', 'health', 'diet'],
  },
  {
    id: 'blog-002', slug: 'top-10-immunity-boosting-foods',
    title: 'Top 10 Immunity Boosting Foods for the Winter Season',
    category: 'Nutrition', author: 'Nutritionist Meera Iyer', date: '2026-02-20',
    readTime: '4 min', excerpt: 'Build your body\'s natural defenses with these scientifically proven superfoods.',
    tags: ['immunity', 'nutrition', 'winter'],
  },
  {
    id: 'blog-003', slug: 'importance-of-regular-health-checkups',
    title: 'The Importance of Regular Full Body Health Checkups',
    category: 'Wellness', author: 'Dr. Rajan Mehta', date: '2026-02-10',
    readTime: '6 min', excerpt: 'Early detection saves lives. Find out why annual checkups are non-negotiable.',
    tags: ['checkup', 'prevention', 'wellness'],
  },
  {
    id: 'blog-004', slug: 'ayurveda-for-modern-healthcare',
    title: 'How Ayurveda Complements Modern Healthcare Practices',
    category: 'Ayurvedic', author: 'Dr. Suresh Nair', date: '2026-01-30',
    readTime: '7 min', excerpt: 'Traditional wisdom meets contemporary medicine for holistic healing.',
    tags: ['ayurveda', 'herbal', 'holistic'],
  },
];

export const DEALS = PRODUCTS.filter(p => p.mrp > p.price).map(p => ({
  ...p,
  discount: Math.round(((p.mrp - p.price) / p.mrp) * 100),
  endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}));

