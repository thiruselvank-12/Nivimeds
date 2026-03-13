"use client";

import React from 'react';
import { ShieldCheck, Truck, Activity, Phone } from 'lucide-react';

const Link = ({ href, children, className }: any) => (
  <a href={href} className={className}>{children}</a>
);

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      {/* Trust Badges Banner */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: ShieldCheck, label: '100% Genuine', sub: 'Authentic medicines guaranteed', color: 'text-[#1E6FD9]', bg: 'bg-blue-50' },
            { icon: Truck, label: 'Fast Delivery', sub: 'Same day delivery available', color: 'text-[#4CAF50]', bg: 'bg-green-50' },
            { icon: Activity, label: 'Secure Payment', sub: 'All payment modes accepted', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: Phone, label: '24/7 Support', sub: 'Dedicated healthcare experts', color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center justify-center space-y-2">
              <div className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">{item.label}</h4>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col">
              <div className="flex items-center font-black tracking-tight text-3xl leading-none">
                <span className="text-[#1E6FD9] lowercase">nivi</span>
                <span className="text-[#4CAF50] lowercase">meds</span>
              </div>
              <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-0.5">Simply Trust</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Nivimeds Pharmacy is your trusted online destination for authentic medicines, healthcare products, and comprehensive lab test services.
            </p>
            <div className="space-y-3">
              <h5 className="font-bold text-gray-800 text-sm">Download our App</h5>
              <div className="flex gap-3">
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold">Apple Store</button>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold">Google Play</button>
              </div>
            </div>
          </div>

          {[
            { title: 'Our Services', links: [
              { label: 'Order Medicines', href: '/medicines' },
              { label: 'Book Lab Tests', href: '/lab-tests' },
              { label: 'Consult a Doctor', href: '/doctor-consultation' },
              { label: 'Ayurveda Articles', href: '/blog' },
              { label: 'Nivimeds Health Plus', href: '/account' },
            ]},
            { title: 'Company', links: [
              { label: 'About Us', href: '#' },
              { label: 'Careers', href: '#' },
              { label: 'Blog', href: '/blog' },
              { label: 'Partner with Nivimeds', href: '#' },
              { label: 'Sell on Nivimeds', href: '#' },
            ]},
            { title: 'Need Help?', links: [
              { label: 'Browse All Medicines', href: '/medicines' },
              { label: 'FAQs', href: '/support' },
              { label: 'Return Policy', href: '/support' },
              { label: 'Store Locator', href: '/store-locator' },
              { label: 'Contact Us', href: '/support' },
            ]},
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-gray-800 mb-4">{col.title}</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-[#1E6FD9] transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-50 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Nivimeds Pharmacy Pvt. Ltd. All rights reserved. | FSSAI Lic. No. 12320999000041</p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-gray-800 transition-colors">Terms &amp; Conditions</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
