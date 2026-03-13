import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware';
import {
  getActiveDoctors,
  getDoctorById,
  getAllDoctorsAdmin,
  createDoctor,
  updateDoctor,
  deleteDoctor
} from '../controllers/doctorController';
import {
  bookAppointment,
  getMyUserAppointments,
  getAllAppointmentsAdmin,
  updateAppointmentStatusAdmin
} from '../controllers/appointmentController';

const router = express.Router();

// --- Doctors ---
router.get('/', getActiveDoctors);
router.get('/:id', getDoctorById);

// Admin Doctor Routes
router.get('/admin/all', protect, admin, getAllDoctorsAdmin);
router.post('/', protect, admin, createDoctor);
router.put('/:id', protect, admin, updateDoctor);
router.delete('/:id', protect, admin, deleteDoctor);

// --- Appointments ---
// User routes
router.post('/appointments/book', protect, bookAppointment);
router.get('/appointments/me', protect, getMyUserAppointments);

// Admin routes
router.get('/admin/appointments', protect, admin, getAllAppointmentsAdmin);
router.patch('/admin/appointments/:id/status', protect, admin, updateAppointmentStatusAdmin);

export default router;
