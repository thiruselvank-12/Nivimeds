"use client";

import React from 'react';
import { ArrowRight, Pill, FileText, HeartPulse } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1E6FD9] to-[#0A4B9C] text-white shadow-lg">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-repeat" />
      <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl space-y-4 mb-8 md:mb-0">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">Need for Meds? Nivimeds!</span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Up to 25% OFF <br /> on Prescribed Medicines</h1>
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
        <div className="hidden md:flex relative w-64 h-64 items-center justify-center">
          <div className="absolute w-full h-full bg-white/10 rounded-full animate-pulse" />
          <div className="absolute w-48 h-48 bg-white/20 rounded-full" />
          <div className="relative z-20 bg-white p-6 rounded-3xl shadow-2xl rotate-3">
            <Pill className="w-16 h-16 text-[#1E6FD9] mb-2" />
            <div className="h-2 w-16 bg-gray-200 rounded-full mb-1" />
            <div className="h-2 w-10 bg-gray-200 rounded-full" />
          </div>
          <div className="absolute top-10 right-0 bg-[#4CAF50] p-3 rounded-2xl shadow-xl -rotate-6">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
