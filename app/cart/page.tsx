"use client";

import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, Trash2, Tag, ArrowRight, ShieldCheck, Package, Truck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/utils';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

export default function CartPage() {
  const { items, updateQuantity, removeItem, coupon, couponError, applyCoupon, removeCoupon, subtotal, discount, deliveryFee, total } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const sub = subtotal();
  const disc = discount();
  const delivery = deliveryFee();
  const tot = total();
  const savings = sub - (tot - delivery);

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-[#1E6FD9]" /> Your Cart
          {items.length > 0 && <span className="text-base font-medium text-gray-500">({items.length} item{items.length !== 1 ? 's' : ''})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add medicines, health products, and more to get started.</p>
            <Link href="/medicines" className="inline-flex items-center gap-2 bg-[#1E6FD9] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              Browse Medicines <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                    <img src={item.image || '/assets/products/medicine_placeholder.svg'} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 leading-snug line-clamp-2">{item.name}</h3>
                        {item.brand && <p className="text-xs text-gray-400 mt-0.5">{item.brand} · {item.unit}</p>}
                        {item.requiresPrescription && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold mt-1">
                            <ShieldCheck className="w-3 h-3" /> Rx Required
                          </span>
                        )}
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0" aria-label="Remove item">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-[#1E6FD9]">{formatCurrency(item.price)}</span>
                        {item.mrp > item.price && <span className="text-sm text-gray-400 line-through">{formatCurrency(item.mrp)}</span>}
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-200 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="Decrease quantity">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-800 w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-200 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="Increase quantity">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Prescription notice */}
              {items.some((i) => i.requiresPrescription) && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-800">Prescription Required</p>
                    <p className="text-xs text-orange-600 mt-0.5">One or more items require a valid prescription. Please upload it during checkout.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-[#4CAF50]" /> Apply Coupon</h3>
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                    <span className="text-sm font-bold text-[#4CAF50]">✓ {coupon.code} applied</span>
                    <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500 text-xs font-semibold">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="NIVI10 or FIRST20"
                      className="flex-1 border-2 border-gray-200 focus:border-[#1E6FD9] rounded-xl px-3 py-2 text-sm outline-none"
                    />
                    <button onClick={() => applyCoupon(couponInput)} className="bg-[#1E6FD9] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700">
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
              </div>

              {/* Price Summary */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Price Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(sub)}</span></div>
                  {disc > 0 && <div className="flex justify-between text-[#4CAF50] font-semibold"><span>Coupon Discount</span><span>−{formatCurrency(disc)}</span></div>}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-[#4CAF50] font-semibold' : ''}>{delivery === 0 ? 'FREE' : formatCurrency(delivery)}</span>
                  </div>
                  {delivery > 0 && (
                    <p className="text-xs text-gray-400">Add {formatCurrency(499 - sub)} more for free delivery</p>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800 text-base">
                  <span>Total</span><span>{formatCurrency(tot)}</span>
                </div>
                {savings > 0 && (
                  <div className="bg-green-50 text-[#4CAF50] text-xs font-bold text-center py-2 rounded-lg">
                    🎉 You save {formatCurrency(savings)} on this order!
                  </div>
                )}
                <Link href="/checkout" className="flex items-center justify-center gap-2 w-full bg-[#4CAF50] hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 rounded-2xl p-4 space-y-2 border border-blue-100">
                {[
                  { icon: Truck, text: 'Same-day delivery available' },
                  { icon: ShieldCheck, text: '100% genuine products' },
                  { icon: Package, text: 'Easy 7-day returns' },
                ].map((i) => (
                  <div key={i.text} className="flex items-center gap-2 text-xs text-[#1E6FD9] font-medium">
                    <i.icon className="w-4 h-4 flex-shrink-0" /> {i.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

