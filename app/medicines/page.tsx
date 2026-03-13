"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, Star, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../lib/mockData';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency, calculateDiscount } from '../../lib/utils';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

const BRANDS = ['All Brands', 'Cipla', 'Sun Pharma', 'Abbott', 'GSK', 'Micro Labs', 'USV', 'Torrent', 'Nivimeds'];
const SORT_OPTIONS = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Discount'];

export default function MedicinesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [otcOnly, setOtcOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Relevance');
  const [priceMax, setPriceMax] = useState(2000);
  const [showFilters, setShowFilters] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== 'All') list = list.filter((p) => p.category === selectedCategory || p.subcategory === selectedCategory);
    if (selectedBrand !== 'All Brands') list = list.filter((p) => p.brand === selectedBrand);
    if (otcOnly) list = list.filter((p) => p.isOTC);
    list = list.filter((p) => p.price <= priceMax);
    switch (sortBy) {
      case 'Price: Low to High': list.sort((a, b) => a.price - b.price); break;
      case 'Price: High to Low': list.sort((a, b) => b.price - a.price); break;
      case 'Rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'Discount': list.sort((a, b) => calculateDiscount(a.price, a.mrp) - calculateDiscount(b.price, b.mrp)); break;
    }
    return list;
  }, [search, selectedCategory, selectedBrand, otcOnly, sortBy, priceMax]);

  const handleAddToCart = (p: typeof PRODUCTS[0]) => {
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

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters — Desktop */}
          <aside className={`w-full md:w-64 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</h3>

              {/* OTC Toggle */}
              <div className="mb-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setOtcOnly(!otcOnly)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${otcOnly ? 'bg-[#4CAF50]' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${otcOnly ? 'translate-x-5' : ''}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">OTC Only (No Rx)</span>
                </label>
              </div>

              {/* Category */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Category</h4>
                <div className="space-y-1">
                  {['All', 'Medicines', 'Pain Relief', 'Antibiotics', 'Diabetes', 'Allergy', 'Gastro', 'Healthcare Devices', 'Nivimeds Exclusive'].map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-blue-50 text-[#1E6FD9] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Brand</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {BRANDS.map((b) => (
                    <button key={b} onClick={() => setSelectedBrand(b)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedBrand === b ? 'bg-blue-50 text-[#1E6FD9] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Max Price: {formatCurrency(priceMax)}</h4>
                <input type="range" min={50} max={2000} step={50} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#1E6FD9]" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹50</span><span>₹2000</span></div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search medicines, brands..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#1E6FD9] focus:ring-2 focus:ring-[#1E6FD9]/10 outline-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold bg-white">
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none font-semibold text-gray-700">
                  {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Quick-toggle OTC pill */}
            <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
              <button onClick={() => setOtcOnly(!otcOnly)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${otcOnly ? 'bg-[#4CAF50] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-[#4CAF50]'}`}>
                ✓ OTC Only (No Rx)
              </button>
              {['Pain Relief', 'Antibiotics', 'Diabetes', 'Allergy', 'Vitamins'].map((tag) => (
                <button key={tag} onClick={() => setSelectedCategory(selectedCategory === tag ? 'All' : tag)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${selectedCategory === tag ? 'bg-[#1E6FD9] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-[#1E6FD9]'}`}>
                  {tag}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-4 font-medium">{filtered.length} products found</p>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => {
                const disc = calculateDiscount(p.price, p.mrp);
                const added = addedToCart === p.id;
                return (
                  <div key={p.id} className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-shadow flex flex-col relative">
                    {disc > 0 && (
                      <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">{disc}% OFF</div>
                    )}
                    {p.requiresPrescription && (
                      <div className="absolute top-4 right-4 z-10 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Rx
                      </div>
                    )}
                    <Link href={`/medicines/${p.slug}`} className="block">
                      <div className="w-full h-40 bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                        <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/products/medicine_placeholder.svg'; }} />
                      </div>
                    </Link>
                    <div className="flex-1 flex flex-col">
                      <Link href={`/medicines/${p.slug}`}>
                        <h3 className="font-semibold text-gray-800 leading-snug line-clamp-2 mb-1 hover:text-[#1E6FD9] transition-colors">{p.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-400 mb-2">{p.brand} · {p.unit}</p>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-[13px] h-[13px] fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                        <span className="text-xs text-gray-400">({p.reviewCount.toLocaleString()})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4 mt-auto">
                        <span className="text-lg font-extrabold text-[#1E6FD9]">{formatCurrency(p.price)}</span>
                        {p.mrp > p.price && <span className="text-sm text-gray-400 line-through">{formatCurrency(p.mrp)}</span>}
                      </div>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all text-sm border-2 ${added ? 'bg-[#4CAF50] text-white border-transparent' : 'bg-white border-[#1E6FD9] text-[#1E6FD9] hover:bg-[#1E6FD9] hover:text-white'}`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {added ? 'Added!' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No products found for your filters.</p>
                <button onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedBrand('All Brands'); setOtcOnly(false); }}
                  className="mt-4 text-[#1E6FD9] font-semibold text-sm hover:underline flex items-center gap-1 mx-auto">
                  <X className="w-4 h-4" /> Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

