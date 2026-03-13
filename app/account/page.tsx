"use client";
import React, { useState } from 'react';
import { User, Package, MapPin, Heart, FileText, Star, ChevronRight, Gift, Award } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../lib/utils';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

const NAV_ITEMS = [
  { icon: User, label: 'Profile', href: '/account' },
  { icon: Package, label: 'My Orders', href: '/orders' },
  { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
  { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
  { icon: FileText, label: 'Prescriptions', href: '/account/prescriptions' },
];

export default function AccountPage() {
  const { user, isLoggedIn, setUser } = useUserStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const GUEST_USER = { name: 'Guest User', email: '', phone: '0000000000', paybackPoints: 0, membershipTier: 'none' as const };
  const u = user ?? GUEST_USER;

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1E6FD9] to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-extrabold text-2xl">
                {u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <h2 className="font-bold text-gray-800 text-lg">{u.name}</h2>
              <p className="text-gray-500 text-sm">{u.email ?? 'No email set'}</p>
              <p className="text-gray-400 text-xs">+91 {u.phone}</p>
              {u.membershipTier !== 'none' && (
                <div className="mt-3 inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                  <Award className="w-3 h-3" /> Health Plus Member
                </div>
              )}
              {!isLoggedIn && (
                <button onClick={() => setShowLogin(true)} className="mt-3 w-full bg-[#1E6FD9] text-white py-2 rounded-xl text-sm font-bold">
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* Payback Points */}
            <div className="bg-gradient-to-br from-[#1E6FD9] to-[#0A4B9C] rounded-2xl p-5 text-white text-center">
              <Gift className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <p className="font-bold text-2xl">{u.paybackPoints}</p>
              <p className="text-blue-200 text-sm">Nivimeds Payback Points</p>
              <p className="text-xs text-blue-300 mt-1">≈ {formatCurrency(Math.floor(u.paybackPoints / 10))} cash value</p>
            </div>

            {/* Nav */}
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {NAV_ITEMS.map((item) => (
                <Link key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#1E6FD9] transition-colors border-b border-gray-50 last:border-0">
                  <item.icon className="w-4 h-4" /> {item.label} <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: '24', icon: Package, color: 'text-[#1E6FD9] bg-blue-50' },
                { label: 'Points Earned', value: u.paybackPoints.toString(), icon: Gift, color: 'text-yellow-600 bg-yellow-50' },
                { label: 'Wishlist Items', value: '8', icon: Heart, color: 'text-red-500 bg-red-50' },
                { label: 'Prescriptions', value: '3', icon: FileText, color: 'text-purple-600 bg-purple-50' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Recent Orders</h3>
                <Link href="/orders" className="text-sm text-[#1E6FD9] font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-4">
                {[
                  { id: 'NV87654321', date: '2026-03-01', items: 'Dolo 650 + 2 more', amount: 245, status: 'Delivered', color: 'text-[#4CAF50] bg-green-50' },
                  { id: 'NV87654320', date: '2026-02-20', items: 'Nivimeds Stress Roll-On', amount: 450, status: 'Delivered', color: 'text-[#4CAF50] bg-green-50' },
                  { id: 'NV87654319', date: '2026-02-10', items: 'FreeStyle Glucometer Kit', amount: 1299, status: 'Delivered', color: 'text-[#4CAF50] bg-green-50' },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">#{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.items}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatCurrency(order.amount)}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.color}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">CURRENT PLAN</span>
                  <h3 className="text-xl font-extrabold mt-2">Health Plus Membership</h3>
                  <p className="text-orange-100 text-sm mt-1">Valid until Dec 31, 2026</p>
                  <div className="mt-3 space-y-1">
                    {['Free delivery on all orders', '5% extra OFF on all products', '2 free doctor consultations/yr'].map((b) => (
                      <p key={b} className="text-sm flex items-center gap-2 text-orange-50"><span>✓</span> {b}</p>
                    ))}
                  </div>
                </div>
                <Star className="w-12 h-12 text-yellow-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

