import { Request, Response } from 'express';
import LabTest from '../models/LabTest';

import LabTestBooking from '../models/LabTestBooking';

export const getLabTests = async (req: Request, res: Response) => {
  try {
    const { search, type } = req.query;
    
    let query: any = {};
    if (search) {
      query.name = { $regex: search as string, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }

    const tests = await LabTest.find(query);
    res.json(tests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { labTestId, member, address, date, timeSlot, price } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: 'Must be logged in to book' });
    }

    const booking = await LabTestBooking.create({
      user: req.user._id,
      labTest: labTestId,
      member,
      address,
      date,
      timeSlot,
      price
    });

    res.status(201).json({ message: 'Booking test successful', booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Seeder function to populate initial lab tests
export const seedLabTests = async (req: Request, res: Response) => {
  try {
    const count = await LabTest.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Lab tests already seeded' });
    }

    const LAB_TESTS_SEED = [
      { name: 'Complete Blood Count (CBC)', type: 'test', sampleType: 'Blood', turnaround: '24 hrs', price: 499, mrp: 699, popular: true },
      { name: 'Lipid Profile', type: 'test', sampleType: 'Blood', turnaround: '12 hrs', price: 599, mrp: 850, popular: true },
      { name: 'HbA1c (Glycosylated Hemoglobin)', type: 'test', sampleType: 'Blood', turnaround: '12 hrs', price: 399, mrp: 550, popular: false },
      { name: 'Thyroid Profile (T3, T4, TSH)', type: 'test', sampleType: 'Blood', turnaround: '24 hrs', price: 699, mrp: 999, popular: true },
      { name: 'Liver Function Test (LFT)', type: 'test', sampleType: 'Blood', turnaround: '24 hrs', price: 550, mrp: 800, popular: false },
      { name: 'Vitamin D (25-OH)', type: 'test', sampleType: 'Blood', turnaround: '48 hrs', price: 1299, mrp: 1800, popular: true },
      { name: 'Comprehensive Full Body Checkup', type: 'package', price: 1499, mrp: 3500, popular: true, testsIncluded: 65 },
      { name: 'Basic Health Screening', type: 'package', price: 999, mrp: 2000, popular: false, testsIncluded: 42 },
      { name: 'Women\'s Wellness Special', type: 'package', price: 1999, mrp: 4500, popular: true, testsIncluded: 75 },
      { name: 'Senior Citizen Package', type: 'package', price: 2499, mrp: 5000, popular: false, testsIncluded: 80 },
    ];

    await LabTest.insertMany(LAB_TESTS_SEED);
    res.status(201).json({ message: 'Lab tests seeded successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
