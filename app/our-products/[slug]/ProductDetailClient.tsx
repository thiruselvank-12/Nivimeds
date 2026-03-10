"use client";

import React, { useState } from 'react';
import { PRODUCTS, type Product } from '../../../lib/mockData';
import { Star, ShoppingCart, ShieldCheck, ChevronRight, Minus, Plus, CheckCircle, Leaf, Package, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { formatCurrency, calculateDiscount } from '../../../lib/utils';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import LoginModal from '../../components/modals/LoginModal';
import AddressModal from '../../components/modals/AddressModal';
import NotificationPanel from '../../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

interface Props { product: Product }

export default function ProductDetailClient({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'usage' | 'reviews'>('details');
  const [added, setAdded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const { addItem } = useCartStore();
  const disc = calculateDiscount(product.price, product.mrp);
  const others = PRODUCTS.filter((p) => p.isNivimedsExclusive && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, mrp: product.mrp, image: product.image, requiresPrescription: product.requiresPrescription, brand: product.brand, unit: product.unit });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
          <ChevronRight className="w-3 h-3" />
          <Link href="/our-products" className="hover:text-[#1E6FD9]">Our Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 aspect-square flex items-center justify-center">
              <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-center cursor-pointer hover:border-[#1E6FD9] h-16 overflow-hidden">
                  <img src={product.image} alt="" className="h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
              ⭐ Nivimeds Exclusive
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight">{product.name}</h1>
            <p className="text-gray-500 leading-relaxed">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#1E6FD9]">{formatCurrency(product.price)}</span>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.mrp)}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-lg">Save {disc}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes · {product.unit}</p>
              {product.isOTC && <span className="inline-flex items-center gap-1 bg-green-100 text-[#4CAF50] text-xs font-bold px-2 py-0.5 rounded-full mt-2">✓ No Prescription Needed</span>}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:bg-gray-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                <span className="font-bold text-gray-800 w-8 text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(10, qty + 1))} className="px-4 py-2 hover:bg-gray-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all ${added ? 'bg-[#4CAF50] text-white' : 'bg-[#1E6FD9] hover:bg-blue-700 text-white'}`}>
                {added ? <><CheckCircle className="w-5 h-5" /> Added to Cart!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </button>
              <Link href="/checkout" className="flex-1 flex items-center justify-center bg-[#4CAF50] hover:bg-green-600 text-white py-3.5 rounded-xl font-bold text-base transition-colors">
                Buy Now
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: ShieldCheck, label: '100% Genuine' },
                { icon: Leaf, label: '100% Natural' },
                { icon: Package, label: 'Easy Returns' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl text-center">
                  <b.icon className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-xs font-semibold text-gray-600">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {(['details', 'ingredients', 'usage', 'reviews'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-bold capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'text-[#1E6FD9] border-b-2 border-[#1E6FD9]' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg">Product Details</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Brand', value: product.brand },
                    { label: 'Category', value: product.category },
                    { label: 'Net Weight / Volume', value: product.unit || 'N/A' },
                    { label: 'Type', value: product.isOTC ? 'Over The Counter (OTC)' : 'Prescription Only (Rx)' },
                  ].map((row) => (
                    <div key={row.label} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{row.label}</p>
                      <p className="text-sm font-bold text-gray-800">{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg">Key Ingredients</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(product.ingredients || []).map((ing) => (
                    <div key={ing} className="flex items-center gap-3 bg-green-50 border border-green-100 p-4 rounded-xl">
                      <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'usage' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg">How to Use</h3>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <p className="text-gray-700 leading-relaxed">{product.dosage || 'Follow the instructions on the label or as directed by your healthcare professional.'}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <p className="text-sm text-orange-700 font-semibold">⚠️ Important: Keep out of reach of children. Store in a cool, dry place. Consult a doctor if symptoms persist.</p>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-5xl font-extrabold text-gray-800">{product.rating}</p>
                    <div className="flex mt-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{product.reviewCount.toLocaleString()} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5,4,3,2,1].map((star) => (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-4 text-gray-500 font-medium">{star}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : 2}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {[
                  { name: 'Vijay S.', rating: 5, comment: 'Works like magic! Instant relief and no side effects. Will definitely buy again.', date: 'Feb 2026' },
                  { name: 'Meera R.', rating: 5, comment: 'Love the natural ingredients. The fragrance is so calming.', date: 'Jan 2026' },
                  { name: 'Suresh K.', rating: 4, comment: 'Good product, fast shipping from Nivimeds. Packaging is premium.', date: 'Jan 2026' },
                ].map((rev) => (
                  <div key={rev.name} className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-[#1E6FD9] font-bold text-sm">{rev.name[0]}</div>
                        <span className="font-semibold text-gray-800 text-sm">{rev.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                        <span className="ml-1">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">Other Nivimeds Exclusives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {others.map((p) => (
              <Link key={p.id} href={`/our-products/${p.slug}`} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">{p.name}</h4>
                  <p className="text-[#1E6FD9] font-bold mt-1">{formatCurrency(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
