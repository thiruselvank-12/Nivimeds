"use client";

import React, { useState, useEffect } from 'react';
import {
  Menu, X, MapPin, ChevronDown, Phone, Bell, ShoppingCart, User,
  FileText, Stethoscope, ShieldCheck, ChevronRight,
} from 'lucide-react';
import SearchOmnibar from '../SearchOmnibar';
import { useCartStore } from '../../../store/cartStore';
import { useUserStore } from '../../../store/userStore';

const Link = ({ href, children, className, onClick }: any) => (
  <a href={href} className={className} onClick={onClick}>{children}</a>
);

interface HeaderProps {
  onLoginClick?: () => void;
  onLocationClick?: () => void;
  onNotificationClick?: () => void;
}

export default function Header({ onLoginClick, onLocationClick, onNotificationClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const { isLoggedIn, user } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 flex flex-col shadow-sm bg-white">
      {/* Layer 1: Utility & Search Header */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 border-b border-gray-100">
        {/* Logo & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="flex flex-col cursor-pointer">
            <div className="flex items-center font-black tracking-tight text-3xl leading-none">
              <img src="/assets/logo.png" alt="NiviMeds Logo" className="h-10 w-auto" />
            </div>
            <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-0.5"></span>
          </Link>
          {/* Location Selector */}
          <button
            onClick={onLocationClick}
            className="hidden lg:flex items-center ml-8 text-sm group cursor-pointer"
          >
            <div className="bg-gray-100 p-2 rounded-full mr-2 group-hover:bg-[#1E6FD9]/10 transition-colors">
              <MapPin className="w-[18px] h-[18px] text-[#1E6FD9]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Delivery Address</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                Chennai - 600100 <ChevronDown className="w-[14px] h-[14px] text-gray-400" />
              </span>
            </div>
          </button>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
          <SearchOmnibar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          <button className="hidden sm:flex text-gray-600 hover:text-[#1E6FD9] transition-colors p-2" title="Contact">
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={onNotificationClick}
            className="text-gray-600 hover:text-[#1E6FD9] transition-colors p-2 relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <Link href="/cart" className="text-gray-600 hover:text-[#1E6FD9] transition-colors p-2 relative">
            <ShoppingCart className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white min-w-[18px] text-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
          {mounted && isLoggedIn && user ? (
            <Link href="/account" className="hidden sm:flex items-center gap-2 border border-gray-200 hover:border-[#1E6FD9] hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-semibold text-[#1E6FD9] transition-colors">
              <User className="w-4 h-4" /> {user.name.split(' ')[0]}
            </Link>
          ) : (
            <button
              onClick={onLoginClick}
              className="hidden sm:flex items-center gap-2 border border-gray-200 hover:border-[#1E6FD9] hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-semibold text-[#1E6FD9] transition-colors"
            >
              <User className="w-4 h-4" /> Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-gray-100">
        <SearchOmnibar isMobile />
      </div>

      {/* Primary Navigation Bar (Green) */}
      <nav className="hidden md:block bg-[#4CAF50] text-white w-full">
        <div className="container mx-auto px-4 lg:px-8">
          <ul className="flex items-center justify-between xl:justify-start xl:space-x-8 text-sm font-medium py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <li className="cursor-pointer hover:text-green-100 transition-colors"><Link href="/medicines" className="hover:text-green-100">Medicines</Link></li>
            <li className="cursor-pointer hover:text-green-100 transition-colors"><Link href="/our-products" className="hover:text-green-100">Our Products</Link></li>
            <li className="cursor-pointer hover:text-green-100 transition-colors"><Link href="/lab-tests" className="hover:text-green-100">Lab Test Booking</Link></li>
            <li className="cursor-pointer hover:text-green-100 transition-colors"><Link href="/account" className="hover:text-green-100">Health Plus</Link></li>
            <li className="cursor-pointer hover:text-green-100 transition-colors flex items-center gap-1">
              <Link href="/doctor-consultation" className="hover:text-green-100">Healthcare Services</Link>
              <ChevronDown className="w-[14px] h-[14px]" />
            </li>
            <li className="cursor-pointer text-yellow-300 font-bold hover:text-yellow-100 transition-colors">
              <Link href="/deals" className="text-yellow-300 hover:text-yellow-100">Today&apos;s Deals</Link>
            </li>
            <li className="cursor-pointer hover:text-green-100 transition-colors ml-auto flex items-center gap-1 bg-white/20 px-3 py-1 rounded-md">
              <Link href="/upload-prescription" className="flex items-center gap-1">
                <FileText className="w-[14px] h-[14px]" /> Prescription Upload
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sub-Navigation Dropdown Bar */}
      <nav className="hidden md:block bg-gray-100/80 border-b border-gray-200 text-gray-600 w-full backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <ul className="flex items-center space-x-8 text-xs font-semibold py-2.5 overflow-x-auto whitespace-nowrap">
            <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors flex items-center gap-1">
              <Link href="/doctor-consultation" className="flex items-center gap-1 hover:text-[#1E6FD9]"><Stethoscope className="w-[14px] h-[14px]" /> Doctor</Link>
            </li>
            <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors flex items-center gap-1">
              <Link href="/upload-prescription" className="flex items-center gap-1 hover:text-[#1E6FD9]"><FileText className="w-[14px] h-[14px]" /> Upload Prescription</Link>
            </li>
            <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors flex items-center gap-1">
              <ShieldCheck className="w-[14px] h-[14px]" /> Insurance
            </li>
            <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors">Nivimeds Payback Points</li>
            <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors">Membership</li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-32 px-4 overflow-y-auto">
          <div className="flex flex-col space-y-4 text-lg font-semibold text-gray-800">
            <div className="border-b pb-4">
              <button onClick={() => { setIsMenuOpen(false); onLoginClick?.(); }}
                className="flex w-full items-center gap-2 bg-[#1E6FD9] text-white px-4 py-3 rounded-xl justify-center">
                <User className="w-5 h-5" /> Login / Sign Up
              </button>
            </div>
            {[
              { href: '/medicines', label: 'Medicines' },
              { href: '/lab-tests', label: 'Lab Tests' },
              { href: '/doctor-consultation', label: 'Consult Doctor' },
              { href: '/our-products', label: 'Our Products' },
              { href: '/deals', label: "Today's Deals" },
              { href: '/upload-prescription', label: 'Upload Prescription', green: true },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}
                className={`flex justify-between items-center py-2 ${item.green ? 'text-[#4CAF50]' : ''}`}>
                {item.label} <ChevronRight className="w-[18px] h-[18px] text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
