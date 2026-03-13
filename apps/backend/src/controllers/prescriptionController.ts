import { Request, Response } from 'express';
import Prescription from '../models/Prescription';

export const uploadPrescription = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Must be logged in' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Assuming multer saves the file to a standard path
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';

    const prescription = await Prescription.create({
      userId: req.user._id,
      fileUrl,
      publicId: req.file.filename,
      fileType,
      status: 'pending',
    });

    res.status(201).json({ message: 'Prescription uploaded successfully', prescription });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to upload prescription' });
  }
};

export const getMyPrescriptions = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Must be logged in' });
    const prescriptions = await Prescription.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch prescriptions' });
  }
};

export const getAllPrescriptions = async (req: Request, res: Response) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch all prescriptions' });
  }
};

export const updatePrescriptionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const prescription = await Prescription.findById(id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    prescription.status = status;
    if (notes) prescription.notes = notes;
    if (req.user) prescription.reviewedBy = req.user._id.toString();
    prescription.reviewedAt = new Date();

    await prescription.save();
    res.json({ message: 'Status updated', prescription });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update status' });
  }
};
