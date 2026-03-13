import { Request, Response } from 'express';
import Supplier from '../models/Supplier';
import Product from '../models/Product';

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    
    // Also fetch products supplied by this vendor
    const products = await Product.find({ supplierId: supplier._id }).select('name stockQuantity slug image');
    
    res.json({ supplier, products });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    // Check if supplier has linked products
    const linkedProducts = await Product.countDocuments({ supplierId: supplier._id });
    if (linkedProducts > 0) {
      return res.status(400).json({ 
        message: `Cannot delete supplier. ${linkedProducts} products are currently linked to this supplier. Please unbind them first.`
      });
    }

    await supplier.deleteOne();
    res.json({ message: 'Supplier deleted completely' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
