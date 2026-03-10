"use client";

import React, { useState } from 'react';
import { LAB_TESTS, HEALTH_PACKAGES } from '../../lib/mockData';
import { Search, FlaskConical, Calendar, Home, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '../../lib/utils';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

export default function LabTestsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'tests' | 'packages'>('tests');
  const [booked, setBooked] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const filteredTests = LAB_TESTS.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-purple-600 to-[#1E6FD9] rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-extrabold mb-2">Lab Tests &amp; Health Packages</h1>
          <p className="text-purple-200 mb-4">Book from 500+ lab tests. Free home sample collection available.</p>
          <div className="flex flex-wrap gap-3">
            {['Free Home Collection', 'Results in 6-24 hrs', 'NABL Certified Labs'].map((f) => (
              <span key={f} className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm"><CheckCircle className="w-3.5 h-3.5 text-green-300" /> {f}</span>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lab tests (e.g. CBC, HbA1c, Lipid Profile)..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1E6FD9] shadow-sm" />
        </div>

        <div className="flex gap-2">
          {(['tests', 'packages'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'bg-[#1E6FD9] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1E6FD9]'}`}>
              {tab === 'tests' ? 'Individual Tests' : 'Health Packages'}
            </button>
          ))}
        </div>

        {activeTab === 'tests' && (
          <div className="space-y-4">
            {filteredTests.map((test) => {
              const disc = calculateDiscount(test.price, test.mrp);
              return (
                <div key={test.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-800">{test.name}</h3>
                      {test.popular && <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">POPULAR</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FlaskConical className="w-3 h-3" /> {test.sampleType}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Results in {test.turnaround}</span>
                      <span className="flex items-center gap-1"><Home className="w-3 h-3 text-[#4CAF50]" /> Free home collection</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-extrabold text-[#1E6FD9] text-lg">{formatCurrency(test.price)}</span>
                      {disc > 0 && <span className="text-[10px] bg-green-100 text-[#4CAF50] font-bold px-1.5 py-0.5 rounded">-{disc}%</span>}
                    </div>
                    <span className="text-xs text-gray-400 line-through">{formatCurrency(test.mrp)}</span>
                  </div>
                  <button
                    onClick={() => { setBooked(test.id); setTimeout(() => setBooked(null), 2000); }}
                    className={`flex-shrink-0 py-2.5 px-5 rounded-xl font-bold text-sm transition-colors min-w-[100px] ${booked === test.id ? 'bg-[#4CAF50] text-white' : 'bg-[#1E6FD9] hover:bg-blue-700 text-white'}`}
                  >
                    {booked === test.id ? 'Booked!' : 'Book Now'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {HEALTH_PACKAGES.map((pkg) => {
              const disc = calculateDiscount(pkg.price, pkg.mrp);
              return (
                <div key={pkg.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  {pkg.popular && <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full mb-3 inline-block">MOST POPULAR</span>}
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-purple-500" /> {pkg.tests} tests included</p>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-extrabold text-[#1E6FD9]">{formatCurrency(pkg.price)}</span>
                    <span className="text-gray-400 line-through text-sm">{formatCurrency(pkg.mrp)}</span>
                    <span className="text-xs bg-green-100 text-[#4CAF50] font-bold px-2 py-0.5 rounded-full">Save {disc}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
                    <Home className="w-3.5 h-3.5 text-[#4CAF50]" /> Free home collection included
                  </div>
                  <button
                    onClick={() => { setBooked(pkg.id); setTimeout(() => setBooked(null), 2000); }}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${booked === pkg.id ? 'bg-[#4CAF50] text-white' : 'bg-[#1E6FD9] hover:bg-blue-700 text-white'}`}
                  >
                    {booked === pkg.id ? <><CheckCircle className="w-4 h-4" /> Booked!</> : <>Book Package <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
