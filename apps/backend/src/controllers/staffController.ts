import { Request, Response } from 'express';
import User from '../models/User';

export const getStaffMembers = async (req: Request, res: Response) => {
  try {
    const staff = await User.find({ role: { $in: ['staff', 'admin'] } }).select('-passwordHash');
    res.json(staff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createStaffMember = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, permissions, role = 'staff' } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ phone });
    if (user) {
      if (user.role !== 'user') {
        return res.status(400).json({ message: 'User is already a staff member or admin' });
      }
      // Upgrade existing user to staff
      user.role = role;
      user.permissions = permissions;
      await user.save();
      return res.json({ message: 'User upgraded to staff', staff: user });
    }

    // Creating a brand new staff user without password (can be set later via forgot password or default)
    user = await User.create({
      name,
      email,
      phone,
      role,
      permissions,
      passwordHash: 'default_password' // Needs proper hashing eventually or let them set it
    });

    res.status(201).json({ message: 'Staff created', staff: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStaffMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, permissions, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Staff member not found' });

    if (user.role === 'admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Cannot edit an admin user' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (permissions) user.permissions = permissions;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();
    res.json({ message: 'Staff member updated', staff: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStaffMember = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Staff member not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin user' });
    }

    // Downgrade to normal user instead of deleting
    user.role = 'user';
    user.permissions = undefined;
    await user.save();

    res.json({ message: 'Staff member access removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
