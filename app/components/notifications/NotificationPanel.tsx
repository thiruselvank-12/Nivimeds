"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Bell, ShoppingCart, Tag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'offer' | 'promo' | 'announcement';
  title: string;
  description: string;
  offer?: string;
  image?: string;
  ctaLabel: string;
  ctaHref: string;
  badge?: string;
  badgeColor?: string;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1', type: 'offer',
    title: 'Nivimeds Headache Relief Balm',
    description: 'Premium Shea Butter & Menthol formula. Instant relief guaranteed.',
    offer: '30% OFF — ₹349 only', badge: 'HOT DEAL', badgeColor: 'bg-red-500',
    image: '/assets/products/nivimeds_headache_relief_balm.png',
    ctaLabel: 'Add to Cart', ctaHref: '/our-products/nivimeds-headache-relief-balm',
  },
  {
    id: 'n2', type: 'promo',
    title: 'Stress Relief Roll-On',
    description: 'Premium amber glass with lavender & chamomile essential oils.',
    offer: '25% OFF — ₹450 only', badge: 'EXCLUSIVE', badgeColor: 'bg-purple-600',
    image: '/assets/products/nivimeds_stress_relief_roll-on.png',
    ctaLabel: 'Shop Now', ctaHref: '/our-products/nivimeds-stress-relief-roll-on',
  },
  {
    id: 'n3', type: 'announcement',
    title: '🎉 Health Plus Membership',
    description: 'Unlock free delivery + 5% extra OFF + 2 free doctor consultations yearly.',
    offer: 'Starting at just ₹499/6mo', badge: 'PREMIUM', badgeColor: 'bg-[#4CAF50]',
    ctaLabel: 'Join Now', ctaHref: '/account',
  },
  {
    id: 'n4', type: 'offer',
    title: 'Ortho Pain Relief Roll-On',
    description: 'White herbal liquid with 12 ayurvedic herbs for joint pain.',
    offer: '25% OFF — ₹899 only', badge: 'BESTSELLER', badgeColor: 'bg-orange-500',
    image: '/assets/products/nivimeds_ortho_pain_relief_roll-On.png',
    ctaLabel: 'Buy Now', ctaHref: '/our-products/nivimeds-ortho-pain-relief-roll-on',
  },
  {
    id: 'n5', type: 'promo',
    title: 'Herbal Inhaler — Clear Congestion',
    description: 'Menthol & Eucalyptus for instant nasal relief. Natural formula.',
    offer: '33% OFF — ₹599', badge: 'NATURAL', badgeColor: 'bg-[#1E6FD9]',
    image: '/assets/products/nivimeds_herbal_Inhaler.png',
    ctaLabel: 'View Product', ctaHref: '/our-products/nivimeds-herbal-inhaler',
  },
  {
    id: 'n6', type: 'announcement',
    title: '📦 Free Delivery This Week',
    description: 'Order medicines above ₹499 and get free same-day delivery. Limited time offer.',
    offer: 'Use code: FREESHIP', badge: 'LIMITED', badgeColor: 'bg-yellow-600',
    ctaLabel: 'Order Now', ctaHref: '/medicines',
  },
];

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [unread, setUnread] = useState(new Set(NOTIFICATIONS.map((n) => n.id)));

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  const markRead = (id: string) => {
    setUnread((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[70] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* Slide Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[80] shadow-2xl flex flex-col transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-label="Notifications panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#1E6FD9] to-[#0A4B9C] text-white">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <div>
              <h2 className="font-bold text-base">Notifications</h2>
              <p className="text-blue-200 text-xs">{unread.size} unread</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F9FF]">
          {NOTIFICATIONS.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              isUnread={unread.has(item.id)}
              onRead={() => markRead(item.id)}
            />
          ))}

          <div className="text-center py-4 text-xs text-gray-400">
            You&apos;ve seen all notifications
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-white">
          <button
            onClick={() => setUnread(new Set())}
            className="text-xs font-semibold text-[#1E6FD9] hover:underline"
          >
            Mark all as read
          </button>
          <a href="/deals" onClick={onClose} className="text-xs font-semibold text-[#4CAF50] flex items-center gap-1 hover:underline">
            View all deals <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </>
  );
}

function NotificationCard({ item, isUnread, onRead }: {
  item: NotificationItem;
  isUnread: boolean;
  onRead: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border overflow-hidden
        ${isUnread ? 'border-[#1E6FD9]/30' : 'border-gray-100'}
      `}
      onClick={onRead}
    >
      {/* Image */}
      {item.image && (
        <div className="w-full h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-contain p-4"
          />
        </div>
      )}

      <div className="p-4 space-y-2">
        {/* Badge + Unread dot */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.badgeColor ?? 'bg-gray-500'}`}>
            {item.badge}
          </span>
          {isUnread && (
            <span className="w-2 h-2 rounded-full bg-[#1E6FD9] flex-shrink-0" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-sm leading-snug">{item.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>

        {/* Offer pill */}
        {item.offer && (
          <div className="inline-flex items-center gap-1 bg-green-50 text-[#4CAF50] text-xs font-bold px-3 py-1 rounded-full border border-green-200">
            <Tag className="w-3 h-3" /> {item.offer}
          </div>
        )}

        {/* CTA */}
        <a
          href={item.ctaHref}
          className="flex items-center gap-2 w-full bg-[#1E6FD9] hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-colors justify-center mt-2"
        >
          <ShoppingCart className="w-4 h-4" /> {item.ctaLabel}
        </a>
      </div>
    </div>
  );
}
