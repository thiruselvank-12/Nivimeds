import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Review from '../../../../models/Review';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const product = await Product.findOne({ slug, isActive: true }).lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Related products
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(6)
      .lean();

    // Latest reviews
    const reviews = await Review.find({ productId: product._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ success: true, product, related, reviews });
  } catch (error) {
    console.error('[product detail]', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
