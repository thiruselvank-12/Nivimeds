"use client";

import React, { useState, useEffect } from 'react';
import {
  Menu, X, MapPin, ChevronDown, Phone, Bell, ShoppingCart, User,
  FileText, Stethoscope, ShieldCheck, ChevronRight, ArrowRight, Pill,
  HeartPulse, Activity, Baby, Leaf, ShieldPlus, Star, FlaskConical, Clock, Truck
} from 'lucide-react';
import SearchOmnibar from './components/SearchOmnibar';
import LoginModal from './components/modals/LoginModal';
import AddressModal from './components/modals/AddressModal';
import NotificationPanel from './components/notifications/NotificationPanel';
import { useCartStore } from '../store/cartStore';

// Fallback Link component to ensure compilation in this preview environment
const Link = ({ href, children, className, onClick }: any) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);

export default function NivimedsHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [addedCart, setAddedCart] = useState<string | null>(null);
  const { addItem, totalItems } = useCartStore();

  useEffect(() => { setMounted(true); }, []);

  const handleAddToCart = (id: string, name: string, price: number, mrp: number, image: string) => {
    addItem({ id, name, price, mrp, image, requiresPrescription: false, brand: 'Nivimeds', unit: '' });
    setAddedCart(id);
    setTimeout(() => setAddedCart(null), 1500);
  };

  // Manage body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-[#F5F9FF] font-sans text-gray-800">
      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      {/* Inject custom scrollbar hide style */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 flex flex-col shadow-sm bg-white">

        {/* Layer 1: Utility & Search Header */}
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 border-b border-gray-100">

          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden text-gray-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex flex-col cursor-pointer">
              {/* Logo text simulating the image provided */}
              <div className="flex items-center font-black tracking-tight text-3xl leading-none">
                <img src="/assets/logo.png" alt="NiviMeds Logo" className="h-10 w-auto" />
              </div>
              <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-0.5"></span>
            </Link>

            {/* Location (Hidden on mobile for space) */}
            <button onClick={() => setShowAddress(true)} className="hidden lg:flex items-center ml-8 text-sm group cursor-pointer" aria-label="Select delivery address">
              <div className="bg-gray-100 p-2 rounded-full mr-2 group-hover:bg-[#1E6FD9]/10 transition-colors">
                <MapPin className="w-[18px] h-[18px] text-[#1E6FD9]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-500 font-medium">Delivery Address</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1">
                  Chennai - 600100 <ChevronDown className="w-[14px] h-[14px] text-gray-400" />
                </span>
              </div>
            </button>
          </div>

          {/* Center Search Bar — Advanced Omnibar (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <SearchOmnibar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <a href="tel:+918001234567" className="hidden sm:flex text-gray-600 hover:text-[#1E6FD9] transition-colors p-2" title="Call Us" aria-label="Call us">
              <Phone className="w-5 h-5" />
            </a>
            <button onClick={() => setShowNotif(true)} className="text-gray-600 hover:text-[#1E6FD9] transition-colors p-2 relative" title="Notifications" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link href="/cart" className="text-gray-600 hover:text-[#1E6FD9] transition-colors p-2 relative" aria-label="Shopping cart">
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white min-w-[18px] text-center">{totalItems() > 99 ? '99+' : totalItems()}</span>
              )}
            </Link>

            <button onClick={() => setShowLogin(true)} className="hidden sm:flex items-center gap-2 border border-gray-200 hover:border-[#1E6FD9] hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-semibold text-[#1E6FD9] transition-colors cursor-pointer" aria-label="Login or sign up">
              <User className="w-4 h-4" /> Login / Sign Up
            </button>
          </div>
        </div>

        {/* Mobile Search Bar — Advanced Omnibar */}
        <div className="md:hidden px-4 py-3 bg-white border-b border-gray-100">
          <SearchOmnibar isMobile />
        </div>

        {/* Layer 2: Primary Navigation Bar (Green) */}
        <nav className="hidden md:block bg-[#4CAF50] text-white w-full">
          <div className="container mx-auto px-4 lg:px-8">
            <ul className="flex items-center justify-between xl:justify-start xl:space-x-8 text-sm font-medium py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <li className="cursor-pointer hover:text-green-100 transition-colors"><a href="/medicines" className="hover:text-green-100">Medicines</a></li>
              <li className="cursor-pointer hover:text-green-100 transition-colors"><a href="/our-products" className="hover:text-green-100">Our Products</a></li>
              <li className="cursor-pointer hover:text-green-100 transition-colors"><a href="/lab-tests" className="hover:text-green-100">Lab Test Booking</a></li>
              <li className="cursor-pointer hover:text-green-100 transition-colors"><a href="/account" className="hover:text-green-100">Health Plus</a></li>
              <li className="cursor-pointer hover:text-green-100 transition-colors flex items-center gap-1"><a href="/doctor-consultation" className="hover:text-green-100 flex items-center gap-1">Healthcare Services <ChevronDown className="w-[14px] h-[14px]" /></a></li>
              <li className="cursor-pointer text-yellow-300 font-bold hover:text-yellow-100 transition-colors"><a href="/deals" className="text-yellow-300 hover:text-yellow-100">Today&apos;s Deals</a></li>
              <li className="cursor-pointer hover:text-green-100 transition-colors ml-auto flex items-center gap-1 bg-white/20 px-3 py-1 rounded-md"><a href="/upload-prescription" className="flex items-center gap-1"><FileText className="w-[14px] h-[14px]" /> Prescription Upload</a></li>
            </ul>
          </div>
        </nav>

        {/* Layer 3: Sub-Navigation Dropdown Bar (Light Gray) */}
        <nav className="hidden md:block bg-gray-100/80 border-b border-gray-200 text-gray-600 w-full backdrop-blur-sm">
          <div className="container mx-auto px-4 lg:px-8">
            <ul className="flex items-center space-x-8 text-xs font-semibold py-2.5 overflow-x-auto whitespace-nowrap">
              <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors flex items-center gap-1"><a href="/doctor-consultation" className="flex items-center gap-1 hover:text-[#1E6FD9]"><Stethoscope className="w-[14px] h-[14px]" /> Doctor</a></li>
              <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors flex items-center gap-1"><a href="/upload-prescription" className="flex items-center gap-1 hover:text-[#1E6FD9]"><FileText className="w-[14px] h-[14px]" /> Upload Prescription</a></li>
              <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors flex items-center gap-1"><a href="/insurance" className="flex items-center gap-1 hover:text-[#1E6FD9]"><ShieldCheck className="w-[14px] h-[14px]" /> Insurance</a></li>
              <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors"><a href="/account" className="hover:text-[#1E6FD9]">Nivimeds Payback Points</a></li>
              <li className="cursor-pointer hover:text-[#1E6FD9] transition-colors"><a href="/account" className="hover:text-[#1E6FD9]">Membership</a></li>
            </ul>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-0 z-40 bg-white pt-32 px-4 overflow-y-auto ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-4 text-lg font-semibold text-gray-800">
            <div className="border-b pb-4">
              <button onClick={() => { setIsMenuOpen(false); setShowLogin(true); }} className="flex w-full items-center gap-2 bg-[#1E6FD9] text-white px-4 py-3 rounded-xl justify-center">
                <User className="w-5 h-5" /> Login / Sign Up
              </button>
            </div>
            <Link href="/medicines" onClick={() => setIsMenuOpen(false)} className="flex justify-between items-center py-2">Medicines <ChevronRight className="w-[18px] h-[18px] text-gray-400" /></Link>
            <Link href="/lab-tests" onClick={() => setIsMenuOpen(false)} className="flex justify-between items-center py-2">Lab Tests <ChevronRight className="w-[18px] h-[18px] text-gray-400" /></Link>
            <Link href="/doctor-consultation" onClick={() => setIsMenuOpen(false)} className="flex justify-between items-center py-2">Consult Doctor <ChevronRight className="w-[18px] h-[18px] text-gray-400" /></Link>
            <Link href="/upload-prescription" onClick={() => setIsMenuOpen(false)} className="flex justify-between items-center py-2 text-[#4CAF50]">Upload Prescription <ChevronRight className="w-[18px] h-[18px] text-gray-400" /></Link>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="container mx-auto px-4 lg:px-8 py-6 space-y-12">

        {/* 1. Hero Promotional Banner */}
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1E6FD9] to-[#0A4B9C] text-white shadow-lg">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-repeat"></div>
          <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-xl space-y-4 mb-8 md:mb-0">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">Need for meds? Nivimeds!</span>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Up to 25% OFF <br /> on Prescribed Medicines
              </h1>
              <p className="text-blue-100 text-lg">Plus get assured Nivimeds Payback Points on every order. Fast delivery across 100+ cities.</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="/medicines" className="bg-[#4CAF50] hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2">
                  Order Medicines <ArrowRight className="w-[18px] h-[18px]" />
                </a>
                <a href="/upload-prescription" className="bg-white hover:bg-blue-50 text-[#1E6FD9] px-6 py-3 rounded-xl font-bold transition-colors shadow-md flex items-center gap-2">
                  <FileText className="w-[18px] h-[18px]" /> Upload Prescription
                </a>
              </div>
            </div>

            {/* Abstract Hero Graphic representing pharmacy/health */}
            <div className="hidden md:flex relative w-64 h-64 items-center justify-center">
              <div className="absolute w-full h-full bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute w-48 h-48 bg-white/20 rounded-full"></div>
              <div className="relative z-20 bg-white p-6 rounded-3xl shadow-2xl rotate-3">
                <Pill className="w-16 h-16 text-[#1E6FD9] mb-2" />
                <div className="h-2 w-16 bg-gray-200 rounded-full mb-1"></div>
                <div className="h-2 w-10 bg-gray-200 rounded-full"></div>
              </div>
              <div className="absolute top-10 right-0 bg-[#4CAF50] p-3 rounded-2xl shadow-xl -rotate-6">
                <HeartPulse className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Shop by Category */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
              <p className="text-gray-500 text-sm mt-1">Explore our wide range of healthcare products</p>
            </div>
            <a href="/medicines" className="text-[#1E6FD9] font-semibold text-sm hover:underline flex items-center cursor-pointer">View All <ChevronRight className="w-4 h-4" /></a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">

            {[
              { href: '/medicines', icon: <Pill className="w-7 h-7 text-[#1E6FD9] group-hover:text-white transition-colors" />, label: 'Medicine' },
              { href: '/medicines?category=healthcare-devices', icon: <Activity className="w-7 h-7 text-[#1E6FD9] group-hover:text-white transition-colors" />, label: 'Healthcare Devices' },
              { href: '/medicines?category=skin-care', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1E6FD9] group-hover:text-white transition-colors"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>, label: 'Skin Care' },
              { href: '/medicines?category=baby-care', icon: <Baby className="w-7 h-7 text-[#1E6FD9] group-hover:text-white transition-colors" />, label: 'Baby Care' },
              { href: '/medicines?category=diabetes-care', icon: <HeartPulse className="w-7 h-7 text-[#1E6FD9] group-hover:text-white transition-colors" />, label: 'Diabetes Care' },
              { href: '/medicines?category=ayurvedic', icon: <Leaf className="w-7 h-7 text-[#1E6FD9] group-hover:text-white transition-colors" />, label: 'Ayurvedic' },
              { href: '/medicines?category=vitamins', icon: <ShieldPlus className="w-7 h-7 text-[#1E6FD9] group-hover:text-white transition-colors" />, label: 'Vitamins & Supps' },
              { href: '/medicines?category=personal-care', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1E6FD9] group-hover:text-white transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>, label: 'Personal Care' },
            ].map((cat) => (
              <a key={cat.label} href={cat.href} className="bg-white p-4 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex flex-col items-center text-center group border border-transparent hover:border-blue-100">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#1E6FD9] transition-colors">
                  {cat.icon}
                </div>
                <span className="text-sm font-semibold text-gray-700 leading-tight">{cat.label}</span>
              </a>
            ))}

          </div>
        </section>

        {/* 3. Nivimeds Exclusive / Best Sellers (Horizontal Scroll) */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Nivimeds Exclusive <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold">TOP RATED</span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">Premium quality healthcare products by Nivimeds</p>
            </div>
            <a href="/our-products" className="text-[#1E6FD9] font-semibold text-sm hover:underline flex items-center cursor-pointer">View All <ChevronRight className="w-4 h-4" /></a>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">

            {[
              { id: 'niv-001', slug: 'nivimeds-headache-relief-balm', name: 'Nivimeds Headache Relief Balm', price: 349, mrp: 499, image: '/assets/products/nivimeds_headache_relief_balm.png', rating: 4.8, off: '30%' },
              { id: 'niv-003', slug: 'nivimeds-ortho-pain-relief-roll-on', name: 'Nivimeds Ortho Pain Relief Roll-On', price: 899, mrp: 1200, image: '/assets/products/nivimeds_ortho_pain_relief_roll-On.png', rating: 4.6, off: '25%' },
              { id: 'niv-002', slug: 'nivimeds-stress-relief-roll-on', name: 'Nivimeds Stress Relief Roll-On', price: 450, mrp: 600, image: '/assets/products/nivimeds_stress_relief_roll-on.png', rating: 4.9, off: '25%' },
              { id: 'niv-004', slug: 'nivimeds-herbal-inhaler', name: 'Nivimeds Herbal Inhaler', price: 599, mrp: 899, image: '/assets/products/nivimeds_herbal_Inhaler.png', rating: 4.7, off: '33%' },
              { id: 'niv-005', slug: 'nivimeds-herbal-mouth-mist', name: 'Nivimeds Herbal Mouth Mist', price: 750, mrp: 950, image: '/assets/products/nivimeds_herbal_mouth_mist.png', rating: 4.5, off: '21%' },
            ].map((p) => (
              <div key={p.id} className="min-w-[240px] max-w-[240px] snap-start bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:shadow-lg transition-shadow relative">
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">{p.off} OFF</div>
                <a href={`/our-products/${p.slug}`} className="w-full h-40 bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden block">
                  <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" />
                </a>
                <div className="flex-1 flex flex-col">
                  <a href={`/our-products/${p.slug}`}><h3 className="font-semibold text-gray-800 leading-snug line-clamp-2 mb-2 hover:text-[#1E6FD9]">{p.name}</h3></a>
                  <div className="flex items-center gap-1 mb-3 mt-auto">
                    <Star className="w-[14px] h-[14px] fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-extrabold text-[#1E6FD9]">₹{p.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{p.mrp}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(p.id, p.name, p.price, p.mrp, p.image)}
                    className={`w-full border-2 py-2 rounded-xl font-bold transition-colors text-sm ${
                      addedCart === p.id
                        ? 'bg-[#4CAF50] border-[#4CAF50] text-white'
                        : 'bg-white border-[#1E6FD9] text-[#1E6FD9] hover:bg-[#1E6FD9] hover:text-white'
                    }`}
                    aria-label={`Add ${p.name} to cart`}
                  >
                    {addedCart === p.id ? '✓ Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* 4. Healthcare Services */}
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">Comprehensive Healthcare Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              { href: '/doctor-consultation', icon: <Stethoscope className="w-7 h-7" />, bg: 'bg-blue-50 text-[#1E6FD9]', title: 'Doctor Consultation', desc: 'Connect with top specialists online or in-clinic.' },
              { href: '/lab-tests', icon: <FlaskConical className="w-7 h-7" />, bg: 'bg-green-50 text-[#4CAF50]', title: 'Lab Test Booking', desc: 'Book tests from home with free sample collection.' },
              { href: '/doctor-consultation', icon: <HeartPulse className="w-7 h-7" />, bg: 'bg-purple-50 text-purple-600', title: 'Healthcare Services', desc: 'Nursing, physiotherapy & more at your doorstep.' },
              { href: '/support', icon: <ShieldCheck className="w-7 h-7" />, bg: 'bg-orange-50 text-orange-600', title: 'Health Insurance', desc: 'Protect your family with affordable health plans.' },
            ].map((svc) => (
              <a key={svc.title} href={svc.href} className="flex flex-col p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${svc.bg}`}>{svc.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#1E6FD9] transition-colors">{svc.title}</h3>
                <p className="text-gray-500 text-sm mb-4 flex-1">{svc.desc}</p>
                <span className="text-[#1E6FD9] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto w-fit">Explore <ArrowRight className="w-4 h-4" /></span>
              </a>
            ))}

          </div>
        </section>

        {/* 5. Health Plus Membership Banner */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden relative shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CAF50] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1E6FD9] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white space-y-4 max-w-xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-[#4CAF50]" />
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Nivimeds <span className="text-[#4CAF50]">Health Plus</span></h2>
              </div>
              <p className="text-gray-300 text-lg">Join our premium membership and unlock exclusive benefits for your family&apos;s health needs.</p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center gap-2 text-gray-200"><Clock className="w-[18px] h-[18px] text-blue-400" /> Free & Priority Delivery</li>
                <li className="flex items-center gap-2 text-gray-200"><Activity className="w-[18px] h-[18px] text-blue-400" /> Extra 5% OFF on all medicines</li>
                <li className="flex items-center gap-2 text-gray-200"><Stethoscope className="w-[18px] h-[18px] text-blue-400" /> 2 Free Doctor Consultations/year</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center min-w-[250px]">
              <p className="text-gray-300 text-sm mb-2">Starting at just</p>
              <p className="text-4xl font-extrabold text-white mb-6">₹499<span className="text-lg font-normal text-gray-400">/6mo</span></p>
              <a href="/account" className="w-full bg-[#4CAF50] hover:bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 block text-center">
                Join Membership
              </a>
            </div>
          </div>
        </section>

        {/* 6. Health Blogs & Articles */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Health Articles & Resources</h2>
              <p className="text-gray-500 text-sm mt-1">Expert written content to help you live healthier</p>
            </div>
            <a href="/blog" className="hidden sm:flex text-[#1E6FD9] font-semibold text-sm hover:underline items-center cursor-pointer">View All <ChevronRight className="w-4 h-4" /></a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {[
              { href: '/blog/understanding-diabetes-complete-guide', category: 'Diabetes Care', title: 'Understanding Diabetes: A Complete Guide to Managing Sugar Levels', time: '5 min read' },
              { href: '/blog/top-10-immunity-boosting-foods', category: 'Nutrition', title: 'Top 10 Immunity Boosting Foods for the Winter Season', time: '4 min read' },
              { href: '/blog/importance-of-regular-health-checkups', category: 'Wellness', title: 'The Importance of Regular Full Body Health Checkups', time: '6 min read' },
            ].map((post) => (
              <a key={post.href} href={post.href} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer flex flex-col group">
                <div className="h-48 bg-blue-50 relative flex items-center justify-center p-6">
                  <FileText className="w-12 h-12 text-blue-200 absolute" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full z-10">{post.category}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-800 text-lg leading-snug mb-3 group-hover:text-[#1E6FD9] transition-colors line-clamp-2">{post.title}</h3>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-500 font-medium">
                    <span>{post.time}</span>
                    <span className="text-[#1E6FD9] font-bold flex items-center gap-1">Read More <ArrowRight className="w-[14px] h-[14px]" /></span>
                  </div>
                </div>
              </a>
            ))}

          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        {/* Trust Badges Banner */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1E6FD9]"><ShieldCheck className="w-6 h-6" /></div>
              <h4 className="font-bold text-gray-800 text-sm">100% Genuine</h4>
              <p className="text-xs text-gray-500">Authentic medicines guaranteed</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#4CAF50]"><Truck className="w-6 h-6" /></div>
              <h4 className="font-bold text-gray-800 text-sm">Fast Delivery</h4>
              <p className="text-xs text-gray-500">Same day delivery available</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500"><Activity className="w-6 h-6" /></div>
              <h4 className="font-bold text-gray-800 text-sm">Secure Payment</h4>
              <p className="text-xs text-gray-500">All payment modes accepted</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500"><Phone className="w-6 h-6" /></div>
              <h4 className="font-bold text-gray-800 text-sm">24/7 Support</h4>
              <p className="text-xs text-gray-500">Dedicated healthcare experts</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col">
                <div className="flex items-center font-black tracking-tight text-3xl leading-none">
                  <span className="text-[#1E6FD9] lowercase">nivi</span>
                  <span className="text-[#4CAF50] lowercase">meds</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-0.5">Simply Trust</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                Nivimeds Pharmacy is your trusted online destination for authentic medicines, healthcare products, and comprehensive lab test services. Effective meds, Expert Nivimeds.
              </p>
              <div className="space-y-3">
                <h5 className="font-bold text-gray-800 text-sm">Download our App</h5>
                <div className="flex gap-3">
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-gray-700 transition-colors">
                    Apple Store
                  </button>
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-gray-700 transition-colors">
                    Google Play
                  </button>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Our Services</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/medicines" className="hover:text-[#1E6FD9] transition-colors">Order Medicines</Link></li>
                <li><Link href="/lab-tests" className="hover:text-[#1E6FD9] transition-colors">Book Lab Tests</Link></li>
                <li><Link href="/doctor-consultation" className="hover:text-[#1E6FD9] transition-colors">Consult a Doctor</Link></li>
                <li><Link href="/blog" className="hover:text-[#1E6FD9] transition-colors">Ayurveda Articles</Link></li>
                <li><Link href="/account" className="hover:text-[#1E6FD9] transition-colors">Nivimeds Health Plus</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/support" className="hover:text-[#1E6FD9] transition-colors">About Us</Link></li>
                <li><Link href="/support" className="hover:text-[#1E6FD9] transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-[#1E6FD9] transition-colors">Blog</Link></li>
                <li><Link href="/support" className="hover:text-[#1E6FD9] transition-colors">Partner with Nivimeds</Link></li>
                <li><Link href="/support" className="hover:text-[#1E6FD9] transition-colors">Sell on Nivimeds</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">Need Help?</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/medicines" className="hover:text-[#1E6FD9] transition-colors">Browse All Medicines</Link></li>
                <li><Link href="/medicines" className="hover:text-[#1E6FD9] transition-colors">Browse All Molecules</Link></li>
                <li><Link href="/support" className="hover:text-[#1E6FD9] transition-colors">FAQs</Link></li>
                <li><Link href="/support" className="hover:text-[#1E6FD9] transition-colors">Return Policy</Link></li>
                <li><Link href="/support" className="hover:text-[#1E6FD9] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="bg-gray-50 py-6 border-t border-gray-200">
          <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 Nivimeds Pharmacy. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/support" className="hover:text-gray-800 transition-colors">Terms & Conditions</Link>
              <Link href="/support" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
              <Link href="/support" className="hover:text-gray-800 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
