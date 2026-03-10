"use client";
import React, { useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';
import { ShieldCheck, ArrowRight, Phone } from 'lucide-react';

export default function InsurancePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header
        onLoginClick={() => setShowLogin(true)}
        onLocationClick={() => setShowAddress(true)}
        onNotificationClick={() => setShowNotif(true)}
      />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-12 space-y-10">
        {/* Hero */}
        <section className="bg-gradient-to-r from-[#1E6FD9] to-[#0A4B9C] rounded-2xl p-10 text-white text-center shadow-lg">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Health Insurance</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Protect your family with affordable, comprehensive health insurance plans. Get covered today.
          </p>
          <a
            href="tel:+918001234567"
            className="inline-flex items-center gap-2 mt-6 bg-white text-[#1E6FD9] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-md"
          >
            <Phone className="w-5 h-5" /> Talk to an Expert
          </a>
        </section>

        {/* Plans */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Basic Plan', price: '₹299/mo', features: ['₹2 Lakh coverage', '1 Adult', 'OPD cover', 'Cashless hospitals'] },
              { title: 'Family Plan', price: '₹799/mo', featured: true, features: ['₹10 Lakh coverage', '4 Members', 'OPD + IPD cover', 'Cashless hospitals', 'Free annual checkup'] },
              { title: 'Senior Plan', price: '₹1,199/mo', features: ['₹15 Lakh coverage', '2 Seniors (60+)', 'Pre-existing conditions', 'Priority support'] },
            ].map((plan) => (
              <div
                key={plan.title}
                className={`rounded-2xl p-6 border flex flex-col ${plan.featured ? 'bg-[#1E6FD9] text-white border-blue-700 shadow-xl scale-105' : 'bg-white border-gray-100 shadow-sm'}`}
              >
                {plan.featured && (
                  <span className="text-xs bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-full w-fit mb-3">Most Popular</span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.featured ? 'text-white' : 'text-gray-800'}`}>{plan.title}</h3>
                <p className={`text-3xl font-extrabold mb-4 ${plan.featured ? 'text-white' : 'text-[#1E6FD9]'}`}>{plan.price}</p>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`text-sm flex items-start gap-2 ${plan.featured ? 'text-blue-100' : 'text-gray-600'}`}>
                      <span className={`mt-0.5 text-lg leading-none ${plan.featured ? 'text-green-300' : 'text-[#4CAF50]'}`}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${plan.featured ? 'bg-white text-[#1E6FD9] hover:bg-blue-50' : 'bg-[#1E6FD9] text-white hover:bg-blue-700'}`}>
                  Get This Plan <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
