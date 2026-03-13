import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const sendOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || phone.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
  }

  // MOCK OTP generation
  const devOtp = '123456'; 
  res.json({ message: 'OTP sent successfully', devOtp });
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { phone, otp, name } = req.body;
  
  if (otp !== '123456') {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  try {
    let user = await User.findOne({ phone });

    // Handle new user creation flow
    if (!user) {
      if (!name) {
        return res.json({ user: { isNewUser: true } });
      }
      user = await User.create({ phone, name, email: `${phone}@nivimeds.local` });
    }

    res.json({
      user: {
        _id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id),
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  res.json({ message: 'Use OTP flow instead' });
};

export const refresh = async (req: Request, res: Response) => {
  res.json({ message: 'Refresh endpoint not fully implemented' });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const { label, name, phone, line1, line2, city, state, pincode, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses.push({ label, name, phone, line1, line2, city, state, pincode, isDefault });
    await user.save();
    
    res.json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { name, relation, age, gender } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.members.push({ name, relation, age, gender });
    await user.save();
    
    res.json({ message: 'Member added successfully', members: user.members });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
