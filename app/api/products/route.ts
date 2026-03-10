import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '../../../lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const otc = searchParams.get('otc') === 'true';
  const sortBy = searchParams.get('sort') ?? 'relevance';

  let results = [...PRODUCTS];
  if (query) results = results.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()));
  if (category) results = results.filter((p) => p.category === category || p.subcategory === category);
  if (otc) results = results.filter((p) => p.isOTC);
  if (sortBy === 'price_asc') results.sort((a, b) => a.price - b.price);
  if (sortBy === 'price_desc') results.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);

  return NextResponse.json({ products: results, total: results.length });
}

export async function POST(req: NextRequest) {
  // Production: validate + save to DB
  const body = await req.json();
  return NextResponse.json({ success: true, message: 'Product created', id: 'new-id' }, { status: 201 });
}
