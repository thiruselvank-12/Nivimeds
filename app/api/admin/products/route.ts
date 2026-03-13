import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { withAdmin, getPagination } from '../../../../lib/apiMiddleware';

// GET /api/admin/products
export const GET = withAdmin(async (req: any) => {
  try {
    await connectDB();
    const { page, limit, skip } = getPagination(req);
    const search = req.nextUrl.searchParams.get('search') || '';
    const query: Record<string, unknown> = {};
    if (search) query.$text = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
});

// POST /api/admin/products
export const POST = withAdmin(async (req: any) => {
  try {
    const body = await req.json();
    await connectDB();

    // Generate slug from name
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-');
    }

    const product = new Product(body);
    await product.save();
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 400 });
    }
    console.error('[admin products POST]', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
});
