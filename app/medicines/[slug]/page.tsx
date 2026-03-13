"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Star, ShoppingCart, Heart, ChevronRight, Minus, Plus, Package, Truck, RefreshCw, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { formatCurrency, calculateDiscount } from '../../../lib/utils';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import LoginModal from '../../components/modals/LoginModal';
import AddressModal from '../../components/modals/AddressModal';
import NotificationPanel from '../../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setRelated(data.related || []);
          setReviews(data.reviews || []);
        } else {
          setError('Product not found');
        }
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const imageUrl = product.images?.[0] || product.image || '/assets/products/medicine_placeholder.svg';
    addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: imageUrl,
      requiresPrescription: product.requiresPrescription,
      brand: product.brand,
      unit: product.unit,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F9FF]">
        <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
            <div className="bg-gray-200 rounded-3xl h-96" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F5F9FF]">
        <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
        <main className="container mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700">Product not found</h1>
          <Link href="/medicines" className="inline-flex items-center gap-2 mt-6 bg-[#1E6FD9] text-white px-6 py-3 rounded-xl font-bold">
            <ArrowLeft className="w-4 h-4" /> Browse Medicines
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.mrp);
  const images: string[] = product.images?.length ? product.images : [product.image || '/assets/products/medicine_placeholder.svg'];

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#1E6FD9]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/medicines" className="hover:text-[#1E6FD9]">Medicines</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-center h-80 relative overflow-hidden">
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">{discount}% OFF</div>
              )}
              {product.requiresPrescription && (
                <div className="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 z-10">
                  <ShieldCheck className="w-3 h-3" /> Rx
                </div>
              )}
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="max-h-64 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/products/medicine_placeholder.svg'; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 bg-white border-2 rounded-xl overflow-hidden transition-colors ${selectedImage === i ? 'border-[#1E6FD9]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <p className="text-sm text-[#1E6FD9] font-semibold mb-1">{product.brand}</p>
              <h1 className="text-2xl font-extrabold text-gray-800 leading-tight">{product.name}</h1>
              {product.unit && <p className="text-sm text-gray-400 mt-1">{product.unit}</p>}
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-700 text-sm">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-400">({product.reviewCount?.toLocaleString() || 0} reviews)</span>
              </div>
            )}

            {/* Pricing */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-[#1E6FD9]">{formatCurrency(product.price)}</span>
              {product.mrp > product.price && (
                <span className="text-lg text-gray-400 line-through mb-0.5">{formatCurrency(product.mrp)}</span>
              )}
              {discount > 0 && (
                <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-lg mb-0.5">{discount}% off</span>
              )}
            </div>

            {product.requiresPrescription && (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <ShieldCheck className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-sm text-orange-800 font-medium">Prescription required for this medicine</p>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3">
              <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-200 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-gray-800 w-10 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="px-4 py-3 hover:bg-gray-200 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  addedToCart
                    ? 'bg-[#4CAF50] text-white border-transparent'
                    : product.inStock
                    ? 'bg-[#1E6FD9] text-white border-transparent hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {addedToCart ? 'Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Package, text: '100% Genuine' },
                { icon: Truck, text: 'Fast Delivery' },
                { icon: RefreshCw, text: 'Easy Returns' },
              ].map((b) => (
                <div key={b.text} className="flex flex-col items-center gap-1 bg-blue-50 rounded-xl p-3 text-center">
                  <b.icon className="w-5 h-5 text-[#1E6FD9]" />
                  <span className="text-xs font-semibold text-[#1E6FD9]">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-bold text-gray-800 text-lg mb-3">Product Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Customer Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#1E6FD9] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.userName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{review.userName}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.title && <p className="font-semibold text-gray-700 text-sm">{review.title}</p>}
                  {review.body && <p className="text-gray-500 text-sm mt-1">{review.body}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-800 text-xl mb-5">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {related.slice(0, 6).map((p: any) => (
                <Link key={p._id} href={`/medicines/${p.slug}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="h-24 flex items-center justify-center mb-3">
                    <img
                      src={p.images?.[0] || p.image || '/assets/products/medicine_placeholder.svg'}
                      alt={p.name}
                      className="max-h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/assets/products/medicine_placeholder.svg'; }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-sm font-extrabold text-[#1E6FD9]">{formatCurrency(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
