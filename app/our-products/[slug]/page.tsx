// Server Component wrapper — handles generateStaticParams
import { PRODUCTS } from '../../../lib/mockData';
import ProductDetailClient from './ProductDetailClient';

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return PRODUCTS.filter((p) => p.isNivimedsExclusive).map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage({ params }: Props) {
  const product = PRODUCTS.find((p) => p.slug === params.slug && p.isNivimedsExclusive);
  if (!product) {
    return <div className="p-12 text-center text-gray-500 min-h-screen bg-[#F5F9FF]">Product not found.</div>;
  }
  return <ProductDetailClient product={product} />;
}
