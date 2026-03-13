import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware';
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController';

const router = express.Router();

// All supplier operations require Admin or Staff role
// Currently, our 'admin' middleware simply checks if user.role === 'admin'.
// In a full production scenario, we'd update authMiddleware to check if user.role === 'admin' || user.role === 'staff' 
// & if they have `permissions.manageProducts` == true. For now we use the `admin` middleware.
router.route('/')
  .get(protect, admin, getSuppliers)
  .post(protect, admin, createSupplier);

router.route('/:id')
  .get(protect, admin, getSupplierById)
  .put(protect, admin, updateSupplier)
  .delete(protect, admin, deleteSupplier);

export default router;
