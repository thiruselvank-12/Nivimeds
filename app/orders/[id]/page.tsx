"use client";
import React, { useState } from 'react';
import { CheckCircle, Package, Truck, ShieldCheck, MapPin, ArrowLeft, Clock } from 'lucide-react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import LoginModal from '../../components/modals/LoginModal';
import AddressModal from '../../components/modals/AddressModal';
import NotificationPanel from '../../components/notifications/NotificationPanel';
import { formatCurrency } from '../../../lib/utils';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

interface Props { params: { id: string } }

const STAGES = [
  { key: 'placed', label: 'Order Placed', icon: ShieldCheck, sub: 'Your order has been confirmed' },
  { key: 'confirmed', label: 'Confirmed', icon: Package, sub: 'Pharmacist has confirmed the order' },
  { key: 'packed', label: 'Packed', icon: Package, sub: 'Your order has been packed' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, sub: 'Your order is on the way' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, sub: 'Order delivered successfully' },
];

export default function OrderTrackingPage({ params }: Props) {
  const currentStage = 3; // 0-indexed, 3 = out_for_delivery
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-3xl space-y-6">
        <Link href="/orders" className="flex items-center gap-2 text-[#1E6FD9] font-semibold text-sm hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Order #{params.id || 'NV87654321'}</h1>
              <p className="text-sm text-gray-500 mt-0.5">Placed on March 1, 2026 · 3 items</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-xl text-[#1E6FD9]">{formatCurrency(724)}</p>
              <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">Out for Delivery</span>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Truck className="w-5 h-5 text-[#1E6FD9]" /> Tracking Timeline</h2>
          <div className="relative space-y-0">
            {STAGES.map((stage, idx) => {
              const done = idx <= currentStage;
              const active = idx === currentStage;
              return (
                <div key={stage.key} className="flex gap-5 pb-6 last:pb-0 relative">
                  {/* Line */}
                  {idx < STAGES.length - 1 && (
                    <div className={`absolute left-5 top-10 w-0.5 h-full ${done && idx < currentStage ? 'bg-[#4CAF50]' : 'bg-gray-200'}`} />
                  )}
                  {/* Circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-all ${active ? 'bg-[#1E6FD9] border-[#1E6FD9] shadow-lg shadow-blue-200' : done ? 'bg-[#4CAF50] border-[#4CAF50]' : 'bg-white border-gray-200'}`}>
                    <stage.icon className={`w-5 h-5 ${done || active ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="pt-1.5">
                    <p className={`font-bold text-sm ${active ? 'text-[#1E6FD9]' : done ? 'text-gray-800' : 'text-gray-400'}`}>{stage.label}</p>
                    <p className={`text-xs mt-0.5 ${done ? 'text-gray-500' : 'text-gray-300'}`}>{stage.sub}</p>
                    {active && <p className="text-xs text-[#4CAF50] font-semibold mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Est. arrival by 6 PM today</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1E6FD9]" /> Delivery To</h3>
          <p className="font-semibold text-gray-800">Ravi Kumar · 9876543210</p>
          <p className="text-sm text-gray-500 mt-1">42, Anna Nagar East, Near Metro Station, Chennai, Tamil Nadu — 600102</p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800">Order Items</h3>
          {[
            { name: 'Dolo 650mg Tablet', qty: 2, price: 60, image: '/assets/products/medicine_placeholder.png' },
            { name: 'Nivimeds Headache Relief Balm', qty: 1, price: 349, image: '/assets/products/nivimeds_headache_relief_balm.png' },
            { name: 'Cetirizine 10mg', qty: 1, price: 22, image: '/assets/products/medicine_placeholder.png' },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                <p className="text-xs text-gray-400">×{item.qty}</p>
              </div>
              <span className="font-bold text-gray-800">{formatCurrency(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
            <span>Total</span><span>{formatCurrency(724)}</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
