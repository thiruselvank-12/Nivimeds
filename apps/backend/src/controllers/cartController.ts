import { Request, Response } from 'express';
import User from '../models/User';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export const syncCart = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    
    // Auth is technically required for syncing to db, but we check if logged in.
    if (!req.user) {
      return res.status(401).json({ message: 'Must be logged in to sync cart' });
    }

    // Update user's remote cart
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real app we would map this to a separate Cart model or user subdocument
    user.cart = items;
    await user.save();

    res.json({ message: 'Cart synced successfully', cart: user.cart });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
