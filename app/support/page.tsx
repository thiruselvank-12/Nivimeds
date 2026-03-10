"use client";
import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Phone, Mail, CheckCircle } from 'lucide-react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const FAQS = [
  { q: 'How do I upload my prescription?', a: 'Go to "Upload Prescription" in the menu, drag or browse your prescription file (JPG/PNG/PDF, max 10MB), and submit. Our pharmacist will review it within 30 minutes.' },
  { q: 'What is the delivery timeline?', a: 'Standard delivery is delivered by the next day. Express delivery is available within 3-4 hours. Same-day delivery is available for orders placed before 3 PM.' },
  { q: 'How do I track my order?', a: 'Go to My Account → Orders and click on any order to see the live tracking timeline with 5 stages: Placed, Confirmed, Packed, Out for Delivery, and Delivered.' },
  { q: 'What is Nivimeds Payback Points?', a: 'Earn 1 point for every ₹10 spent. 10 points = ₹1. Use your points for discounts on future orders. Points never expire as long as your account is active.' },
  { q: 'Are the medicines genuine?', a: 'Yes. All medicines are sourced directly from licensed manufacturers and distributors. We are FSSAI certified and comply with all pharmacy regulations.' },
  { q: 'How do I return a product?', a: 'We offer easy 7-day returns for most products. Go to My Orders, select the order, and click "Return/Replace". Prescription medicines cannot be returned.' },
  { q: 'What are the payment options?', a: 'We accept UPI, Credit/Debit Cards, Net Banking, Digital Wallets, and Cash on Delivery.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${open ? 'border-[#1E6FD9]' : 'border-gray-200'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left gap-4">
        <span className="font-semibold text-gray-800">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</div>}
    </div>
  );
}

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl space-y-10">
        <div className="bg-gradient-to-r from-[#1E6FD9] to-[#0A4B9C] rounded-2xl p-8 text-white text-center">
          <h1 className="text-3xl font-extrabold mb-2">How can we help?</h1>
          <p className="text-blue-200">Our healthcare support team is here for you 24/7.</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Phone, label: 'Call Us', sub: '+91 1800 123 4567', color: 'bg-green-50 text-[#4CAF50]' },
            { icon: MessageCircle, label: 'Live Chat', sub: 'Average wait: 2 mins', color: 'bg-blue-50 text-[#1E6FD9]' },
            { icon: Mail, label: 'Email Support', sub: 'support@nivimeds.com', color: 'bg-purple-50 text-purple-600' },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center space-y-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto ${c.color}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800">{c.label}</h3>
              <p className="text-sm text-gray-500">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {FAQS.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Send us a message</h2>
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle className="w-12 h-12 text-[#4CAF50] mx-auto" />
              <p className="font-bold text-gray-800">Message Sent!</p>
              <p className="text-sm text-gray-500">We&apos;ll get back to you within 2 hours.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border-2 border-gray-200 focus:border-[#1E6FD9] rounded-xl px-4 py-3 text-sm outline-none" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-2 border-gray-200 focus:border-[#1E6FD9] rounded-xl px-4 py-3 text-sm outline-none" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full border-2 border-gray-200 focus:border-[#1E6FD9] rounded-xl px-4 py-3 text-sm outline-none resize-none" placeholder="Describe your issue or question..." />
              </div>
              <button onClick={() => { if (name && email && message) setSubmitted(true); }} className="w-full bg-[#1E6FD9] hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors">
                Send Message
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
