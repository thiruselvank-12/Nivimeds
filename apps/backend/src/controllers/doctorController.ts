import { Request, Response } from 'express';
import Doctor from '../models/Doctor';

// Public endpoints
export const getActiveDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find({ isActive: true });
    res.json(doctors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin endpoints
export const getAllDoctorsAdmin = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
