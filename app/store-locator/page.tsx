"use client";
import React, { useState } from 'react';
import { MapPin, Phone, Clock, Search, Navigation } from 'lucide-react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const STORES = [
  { id: 's1', name: 'Nivimeds Anna Nagar', address: '42, Anna Nagar Main Road, Chennai - 600040', city: 'Chennai', phone: '+91 44 2626 1234', hours: 'Mon-Sat: 8AM-10PM · Sun: 9AM-8PM', isOpen: true, lat: 13.0878, lng: 80.2101 },
  { id: 's2', name: 'Nivimeds T. Nagar', address: '12, Pondy Bazaar, T. Nagar, Chennai - 600017', city: 'Chennai', phone: '+91 44 2434 5678', hours: 'Mon-Sun: 8AM-11PM', isOpen: true, lat: 13.0418, lng: 80.2341 },
  { id: 's3', name: 'Nivimeds Adyar', address: '55, Gandhi Nagar, Adyar, Chennai - 600020', city: 'Chennai', phone: '+91 44 2440 9012', hours: 'Mon-Sat: 9AM-9PM · Sun: 10AM-7PM', isOpen: false, lat: 13.0012, lng: 80.2565 },
  { id: 's4', name: 'Nivimeds Bandra', address: '18, Hill Road, Bandra West, Mumbai - 400050', city: 'Mumbai', phone: '+91 22 2640 3456', hours: 'Mon-Sun: 24/7', isOpen: true, lat: 19.0596, lng: 72.8295 },
  { id: 's5', name: 'Nivimeds Connaught Place', address: 'N-12, Inner Circle, Connaught Place, New Delhi - 110001', city: 'Delhi', phone: '+91 11 2334 7890', hours: 'Mon-Sat: 9AM-9PM', isOpen: true, lat: 28.6328, lng: 77.2197 },
];

export default function StoreLocatorPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const filtered = STORES.filter((s) => s.city.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-6">
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E6FD9] rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-extrabold mb-2">Find a Nivimeds Store</h1>
          <p className="text-green-100">Walk-in or place an order for pickup. {STORES.length} stores across India.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by city or store name..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1E6FD9] shadow-sm" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store List */}
          <div className="space-y-4">
            {filtered.map((store) => (
              <div key={store.id} onClick={() => setSelected(store.id)}
                className={`bg-white rounded-2xl p-5 shadow-sm border-2 cursor-pointer transition-all ${selected === store.id ? 'border-[#1E6FD9] shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-800">{store.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${store.isOpen ? 'bg-green-100 text-[#4CAF50]' : 'bg-red-100 text-red-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${store.isOpen ? 'bg-[#4CAF50] animate-pulse' : 'bg-red-500'}`} />
                    {store.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm text-gray-500">
                  <p className="flex items-start gap-2"><MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#1E6FD9]" /> {store.address}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 flex-shrink-0 text-[#4CAF50]" /> {store.phone}</p>
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4 flex-shrink-0 text-orange-500" /> {store.hours}</p>
                </div>
                <a href={`https://maps.google.com/?q=${store.lat},${store.lng}`} target="_blank" rel="noreferrer"
                  className="mt-4 flex items-center gap-2 text-[#1E6FD9] font-semibold text-sm hover:underline" onClick={(e) => e.stopPropagation()}>
                  <Navigation className="w-4 h-4" /> Get Directions
                </a>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24 h-[500px] flex items-center justify-center">
            <div className="text-center space-y-3 p-8">
              <MapPin className="w-16 h-16 text-gray-200 mx-auto" />
              <h3 className="font-bold text-gray-600">Interactive Map</h3>
              <p className="text-sm text-gray-400">Integrate Google Maps API by adding<br /><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code><br />to your .env.local</p>
              {selected && (
                <div className="bg-blue-50 rounded-xl p-3 text-[#1E6FD9] text-sm font-semibold border border-blue-100">
                  📍 {STORES.find((s) => s.id === selected)?.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
