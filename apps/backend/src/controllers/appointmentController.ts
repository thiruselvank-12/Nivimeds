import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

// User endpoints
export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      userId: req.user?._id,
      status: 'pending'
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyUserAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({ userId: req.user?._id })
      .populate('doctorId', 'name specialty image')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin endpoints
export const getAllAppointmentsAdmin = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctorId', 'name specialty')
      .populate('userId', 'name phone')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { status, meetLink } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (status) appointment.status = status;
    if (meetLink) appointment.meetLink = meetLink;

    await appointment.save();
    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
