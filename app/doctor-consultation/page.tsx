"use client";

import React, { useState } from 'react';
import { DOCTORS } from '../../lib/mockData';
import { Star, Video, MessageCircle, ChevronDown, Search, Clock, ArrowRight } from 'lucide-react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';
import { formatCurrency } from '../../lib/utils';

const SPECIALIZATIONS = ['All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Diabetologist', 'Orthopedist', 'Neurologist'];

export default function DoctorConsultationPage() {
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('All');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);

  const filtered = DOCTORS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchSpec = spec === 'All' || d.specialization === spec;
    return matchSearch && matchSpec;
  });

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-[#1E6FD9] to-[#0A4B9C] rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-extrabold mb-2">Talk to a Doctor</h1>
          <p className="text-blue-200 mb-4">Connect with 500+ specialists online. Consultations starting at ₹199.</p>
          <div className="flex items-center gap-4 text-sm">
            {['Available 24/7', 'Board Certified Doctors', 'Secure & Private'].map((f) => (
              <span key={f} className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"><span className="text-green-300">✓</span> {f}</span>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or specialization..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1E6FD9]" />
          </div>
          <select value={spec} onChange={(e) => setSpec(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none font-semibold text-gray-700">
            {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Specialization Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {SPECIALIZATIONS.map((s) => (
            <button key={s} onClick={() => setSpec(s)} className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${spec === s ? 'bg-[#1E6FD9] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-[#1E6FD9]'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl font-extrabold text-[#1E6FD9]">
                    {doc.name.split('.')[1]?.trim()[0] ?? 'D'}
                  </div>
                  {doc.available ? (
                    <div className="flex items-center gap-1 mt-1 bg-green-100 text-[#4CAF50] text-[10px] font-bold px-2 py-0.5 rounded-full justify-center">
                      <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-pulse" /> Online
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-400 text-center mt-1 font-semibold">Away</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg">{doc.name}</h3>
                  <p className="text-[#1E6FD9] text-sm font-semibold">{doc.specialization}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{doc.education}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> <strong>{doc.rating}</strong></span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{doc.experience} yrs exp</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{doc.reviewCount} reviews</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.languages.map((l) => <span key={l} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{l}</span>)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Consultation Fee</p>
                  <p className="font-extrabold text-[#1E6FD9] text-xl">{formatCurrency(doc.fee)}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 border border-gray-200 hover:border-[#1E6FD9] text-gray-600 hover:text-[#1E6FD9] px-3 py-2 rounded-xl text-xs font-semibold transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" /> Chat
                  </button>
                  <button
                    onClick={() => { setBooked(doc.id); setTimeout(() => setBooked(null), 2000); }}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-colors min-w-[80px] justify-center ${booked === doc.id ? 'bg-[#4CAF50] text-white' : 'bg-[#1E6FD9] hover:bg-blue-700 text-white'}`}
                  >
                    <Video className="w-3.5 h-3.5" /> {booked === doc.id ? 'Booked!' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
