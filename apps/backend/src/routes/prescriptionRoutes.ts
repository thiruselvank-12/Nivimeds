import express from 'express';
import { uploadPrescription, getMyPrescriptions, getAllPrescriptions, updatePrescriptionStatus } from '../controllers/prescriptionController';
import { protect, admin } from '../middlewares/authMiddleware';
// Assuming you have an upload middleware configured (like multer) 
// If not, we will need to ensure index.ts handles file uploads properly or create one
import upload from '../middlewares/uploadMiddleware'; 

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadPrescription);
router.get('/my-prescriptions', protect, getMyPrescriptions);
router.get('/', protect, admin, getAllPrescriptions);
router.patch('/:id/status', protect, admin, updatePrescriptionStatus);

export default router;
