"use client";

import React, { useState } from 'react';
import { PRODUCTS } from '../../lib/mockData';
import { Star, ShoppingCart, ChevronRight, Zap, Tag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency, calculateDiscount } from '../../lib/utils';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

const exclusives = PRODUCTS.filter((p) => p.isNivimedsExclusive);

export default function OurProductsPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const handleAdd = (p: typeof PRODUCTS[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, mrp: p.mrp, image: p.image, requiresPrescription: p.requiresPrescription, brand: p.brand, unit: p.unit });
    setAddedToCart(p.id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-10">
        {/* Hero Banner */}
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E6FD9] via-blue-600 to-[#0A4B9C] text-white p-8 md:p-12 shadow-xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#4CAF50] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-4">
              <Zap className="w-3.5 h-3.5" /> Nivimeds Exclusive
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">Our Signature Healthcare Products</h1>
            <p className="text-blue-100 text-lg mb-6">Premium Ayurvedic & herbal formulations crafted by our expert team. Trusted by 50,000+ customers.</p>
            <div className="flex gap-3">
              <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold"><Tag className="w-4 h-4" /> Up to 33% OFF</span>
              <span className="flex items-center gap-2 bg-[#4CAF50] px-4 py-2 rounded-xl text-sm font-semibold">100% Natural</span>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">All Nivimeds Exclusive Products</h2>
              <p className="text-gray-500 text-sm mt-1">{exclusives.length} premium products</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exclusives.map((p) => {
              const disc = calculateDiscount(p.price, p.mrp);
              const added = addedToCart === p.id;
              return (
                <div key={p.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-xl transition-all group relative flex flex-col">
                  {disc > 0 && (
                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">{disc}% OFF</div>
                  )}
                  <div className="absolute top-4 right-4 z-10 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full">EXCLUSIVE</div>

                  <Link href={`/our-products/${p.slug}`} className="block">
                    <div className="w-full h-48 bg-gray-50 rounded-xl mb-5 flex items-center justify-center overflow-hidden group-hover:bg-blue-50 transition-colors">
                      <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" />
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <Link href={`/our-products/${p.slug}`}>
                      <h3 className="font-bold text-gray-800 text-lg leading-snug mb-1 group-hover:text-[#1E6FD9] transition-colors">{p.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{p.description}</p>

                    {/* Ingredients preview */}
                    {p.ingredients && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {p.ingredients.slice(0, 3).map((ing) => (
                          <span key={ing} className="text-[10px] bg-green-50 text-[#4CAF50] px-2 py-0.5 rounded-full font-semibold">{ing}</span>
                        ))}
                        {(p.ingredients.length > 3) && (
                          <span className="text-[10px] text-gray-400 px-2 py-0.5">+{p.ingredients.length - 3} more</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1 mb-4 mt-auto">
                      <Star className="w-[14px] h-[14px] fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-700">{p.rating}</span>
                      <span className="text-xs text-gray-400">({p.reviewCount} reviews)</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-extrabold text-[#1E6FD9]">{formatCurrency(p.price)}</span>
                      <span className="text-sm text-gray-400 line-through">{formatCurrency(p.mrp)}</span>
                      <span className="text-xs font-bold text-[#4CAF50] bg-green-50 px-2 py-0.5 rounded-full">Save {disc}%</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAdd(p)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${added ? 'bg-[#4CAF50] text-white border-transparent' : 'bg-white border-[#1E6FD9] text-[#1E6FD9] hover:bg-[#1E6FD9] hover:text-white'}`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {added ? 'Added!' : 'Add to Cart'}
                      </button>
                      <Link href={`/our-products/${p.slug}`} className="flex items-center justify-center p-2.5 border-2 border-gray-200 hover:border-[#1E6FD9] rounded-xl text-gray-500 hover:text-[#1E6FD9] transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trust section */}
        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Why Choose Nivimeds Exclusive?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '🌿', title: '100% Natural', sub: 'No harmful chemicals or additives' },
              { emoji: '🔬', title: 'Lab Tested', sub: 'Clinically tested & certified' },
              { emoji: '🏆', title: '50K+ Customers', sub: 'Trusted by thousands daily' },
              { emoji: '🚚', title: 'Fast Delivery', sub: 'Same-day delivery available' },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-2">
                <div className="text-3xl">{item.emoji}</div>
                <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

