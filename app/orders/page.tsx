"use client";
import React, { useState } from 'react';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

const ORDERS = [
  { id: 'NV87654325', date: '2026-03-10', items: 3, amount: 724, status: 'Out for Delivery', statusColor: 'bg-orange-100 text-orange-700' },
  { id: 'NV87654324', date: '2026-03-05', items: 1, amount: 349, status: 'Delivered', statusColor: 'bg-green-100 text-[#4CAF50]' },
  { id: 'NV87654323', date: '2026-02-20', items: 4, amount: 1450, status: 'Delivered', statusColor: 'bg-green-100 text-[#4CAF50]' },
  { id: 'NV87654322', date: '2026-02-10', items: 2, amount: 899, status: 'Delivered', statusColor: 'bg-green-100 text-[#4CAF50]' },
  { id: 'NV87654321', date: '2026-01-28', items: 2, amount: 250, status: 'Delivered', statusColor: 'bg-green-100 text-[#4CAF50]' },
];

export default function OrdersPage() {
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
        <div className="flex items-center gap-3">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Package className="w-6 h-6 text-[#1E6FD9]" /> My Orders</h1>
        </div>

        <div className="space-y-4">
          {ORDERS.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">Order #{order.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.date} · {order.items} item{order.items !== 1 ? 's' : ''}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-[#1E6FD9] text-lg">{formatCurrency(order.amount)}</p>
                <Link href={`/orders/${order.id}`} className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-[#1E6FD9] transition-colors">
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

