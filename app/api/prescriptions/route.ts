import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Prescription from '../../../models/Prescription';
import { uploadImage } from '../../../lib/cloudinary';
import { withAuth } from '../../../lib/apiMiddleware';

// POST /api/prescriptions — Upload prescription
export const POST = withAuth(async (req: any) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const notes = formData.get('notes') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only images (JPG, PNG, WebP) and PDFs are allowed' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 });
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await uploadImage(buffer, `nivimeds/prescriptions/${req.user.userId}`, {
      resource_type: file.type === 'application/pdf' ? 'raw' : 'image',
      format: file.type === 'application/pdf' ? 'pdf' : undefined,
    });

    await connectDB();

    const prescription = new Prescription({
      userId: req.user.userId,
      fileUrl: result.url,
      publicId: result.publicId,
      fileType: file.type === 'application/pdf' ? 'pdf' : 'image',
      notes: notes || '',
    });

    await prescription.save();

    return NextResponse.json({ success: true, prescription });
  } catch (error) {
    console.error('[prescription upload]', error);
    return NextResponse.json({ error: 'Failed to upload prescription' }, { status: 500 });
  }
});

// GET /api/prescriptions — List user's prescriptions
export const GET = withAuth(async (req: any) => {
  try {
    await connectDB();
    const prescriptions = await Prescription.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, prescriptions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
});
