import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Product from '../../../../../models/Product';
import { withAdmin } from '../../../../../lib/apiMiddleware';

// PATCH /api/admin/products/[id]
export const PATCH = withAdmin(async (req: any, context: any) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    await connectDB();

    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
});

// DELETE /api/admin/products/[id]
export const DELETE = withAdmin(async (req: any, context: any) => {
  try {
    const { id } = await context.params;
    await connectDB();
    await Product.findByIdAndUpdate(id, { isActive: false }); // soft delete
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
});
