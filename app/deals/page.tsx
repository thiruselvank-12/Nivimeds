"use client";
import React, { useState, useEffect } from 'react';
import { DEALS } from '../../lib/mockData';
import { Tag, ShoppingCart, Star, Clock } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/utils';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

function useCountdown(targetIso: string) {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (diff <= 0) { setRemaining('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetIso]);
  return remaining;
}

function CountdownBadge({ endsAt }: { endsAt: string }) {
  const t = useCountdown(endsAt);
  return <span className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> {t}</span>;
}

export default function DealsPage() {
  const [added, setAdded] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const { addItem } = useCartStore();

  const handleAdd = (p: typeof DEALS[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, mrp: p.mrp, image: p.image, requiresPrescription: p.requiresPrescription, brand: p.brand, unit: p.unit });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white text-center">
          <Tag className="w-10 h-10 mx-auto mb-2 text-yellow-200" />
          <h1 className="text-3xl font-extrabold">Today&apos;s Best Deals</h1>
          <p className="text-red-100 mt-2">Flash sale! Limited time offers on medicines &amp; health products.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {DEALS.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-shadow group flex flex-col relative">
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-extrabold px-2 py-1 rounded-lg z-10">{p.discount}% OFF</div>
              <div className="w-full h-36 bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:bg-blue-50 transition-colors">
                <img src={p.image} alt={p.name} className="h-full w-full object-contain p-3" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/products/medicine_placeholder.svg'; }} />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-1">{p.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{p.brand}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                </div>
                <div className="mb-2"><CountdownBadge endsAt={p.endsAt} /></div>
                <div className="flex items-center gap-2 mb-3 mt-auto">
                  <span className="text-lg font-extrabold text-[#1E6FD9]">{formatCurrency(p.price)}</span>
                  <span className="text-sm text-gray-400 line-through">{formatCurrency(p.mrp)}</span>
                </div>
                <button onClick={() => handleAdd(p)} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${added === p.id ? 'bg-[#4CAF50] text-white border-transparent' : 'bg-white border-[#1E6FD9] text-[#1E6FD9] hover:bg-[#1E6FD9] hover:text-white'}`}>
                  <ShoppingCart className="w-4 h-4" /> {added === p.id ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

