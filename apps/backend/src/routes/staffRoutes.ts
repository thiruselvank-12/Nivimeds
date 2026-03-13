import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware';
import {
  getStaffMembers,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember
} from '../controllers/staffController';

const router = express.Router();

// Only master admins can manage staff for now
router.route('/')
  .get(protect, admin, getStaffMembers)
  .post(protect, admin, createStaffMember);

router.route('/:id')
  .put(protect, admin, updateStaffMember)
  .delete(protect, admin, deleteStaffMember);

export default router;
