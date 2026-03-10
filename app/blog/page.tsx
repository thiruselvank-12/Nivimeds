"use client";
import React, { useState } from 'react';
import { BLOG_POSTS } from '../../lib/mockData';
import { Calendar, Clock, ChevronRight, Tag } from 'lucide-react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

const CATEGORIES = ['All', 'Diabetes Care', 'Nutrition', 'Wellness', 'Ayurvedic'];

export default function BlogPage() {
  const [active, setActive] = useState('All');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const filtered = active === 'All' ? BLOG_POSTS : BLOG_POSTS.filter((b) => b.category === active);

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-[#1E6FD9] to-purple-700 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-extrabold mb-2">Nivimeds Health Blog</h1>
          <p className="text-blue-200">Expert articles by verified doctors and nutritionists.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)} className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition-colors whitespace-nowrap ${active === cat ? 'bg-[#1E6FD9] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
              <div className="h-36 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center text-6xl">
                {post.category === 'Diabetes Care' ? '🩸' : post.category === 'Nutrition' ? '🥗' : post.category === 'Ayurvedic' ? '🌿' : '❤️'}
              </div>
              <div className="p-5 space-y-3">
                <span className="text-[10px] bg-blue-50 text-[#1E6FD9] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><Tag className="w-2.5 h-2.5" /> {post.category}</span>
                <h2 className="font-bold text-gray-800 leading-snug group-hover:text-[#1E6FD9] transition-colors">{post.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} read</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">By {post.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
