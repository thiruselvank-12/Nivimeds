import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') || '';
    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, products: [] });
    }

    await connectDB();

    const products = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('[search]', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
