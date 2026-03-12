import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Product from '../../../models/Product';
import { getPagination } from '../../../lib/apiMiddleware';
import { redisGet, redisSet } from '../../../lib/redis';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const otcOnly = searchParams.get('otcOnly') === 'true';
    const inStockOnly = searchParams.get('inStockOnly') !== 'false';
    const priceMin = Number(searchParams.get('priceMin') || 0);
    const priceMax = Number(searchParams.get('priceMax') || 999999);
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const { page, limit, skip } = getPagination(req);
    const featured = searchParams.get('featured') === 'true';
    const exclusive = searchParams.get('exclusive') === 'true';

    // Cache key for non-search requests
    const cacheKey = `products:${searchParams.toString()}`;
    if (!search) {
      const cached = await redisGet(cacheKey);
      if (cached) return NextResponse.json(JSON.parse(cached));
    }

    await connectDB();

    // Build query
    const query: Record<string, unknown> = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (category && category !== 'All') query.category = { $regex: category, $options: 'i' };
    if (brand && brand !== 'All Brands') query.brand = { $regex: brand, $options: 'i' };
    if (otcOnly) query.isOTC = true;
    if (inStockOnly) query.inStock = true;
    if (featured) query.rating = { $gte: 4.0 };
    if (exclusive) query.isNivimedsExclusive = true;
    query.price = { $gte: priceMin, $lte: priceMax };

    // Sort
    let sortObj: Record<string, 1 | -1 | { $meta: string }> = {};
    switch (sortBy) {
      case 'price_asc': sortObj = { price: 1 }; break;
      case 'price_desc': sortObj = { price: -1 }; break;
      case 'rating': sortObj = { rating: -1 }; break;
      case 'discount': sortObj = { mrp: -1 }; break;
      case 'newest': sortObj = { createdAt: -1 }; break;
      default:
        if (search) sortObj = { score: { $meta: 'textScore' } };
        else sortObj = { rating: -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(query, search ? { score: { $meta: 'textScore' } } : {})
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const result = {
      success: true,
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };

    // Cache for 5 minutes (non-search results)
    if (!search) {
      await redisSet(cacheKey, JSON.stringify(result), 300);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[products GET]', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
