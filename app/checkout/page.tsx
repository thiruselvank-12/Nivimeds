"use client";

import React, { useState } from 'react';
import { MapPin, Truck, CreditCard, CheckCircle, ChevronRight, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency, generateOrderId } from '../../lib/utils';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

type Step = 'address' | 'delivery' | 'payment' | 'confirmed';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', sub: 'Pay via any UPI app', icon: '💳' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: '🏦' },
  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks', icon: '🏛️' },
  { id: 'wallet', label: 'Wallet', sub: 'Paytm, PhonePe, Amazon Pay', icon: '👛' },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
];

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', sub: 'Delivered by tomorrow', price: 0, badge: 'FREE' },
  { id: 'express', label: 'Express Delivery', sub: 'Delivered in 3-4 hours', price: 79, badge: 'FAST' },
  { id: 'schedule', label: 'Scheduled Delivery', sub: 'Choose your time slot', price: 29, badge: null },
];

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('address');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [upiId, setUpiId] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [orderId] = useState(generateOrderId());
  const { items, subtotal, discount, deliveryFee, total, clearCart } = useCartStore();

  const sub = subtotal();
  const disc = discount();
  const delivery = deliveryOption === 'standard' ? deliveryFee() : deliveryOption === 'express' ? 79 : 29;
  const tot = sub - disc + delivery;

  const handlePlaceOrder = () => {
    setStep('confirmed');
    clearCart();
  };

  const STEPS = [
    { key: 'address', label: 'Address', icon: MapPin },
    { key: 'delivery', label: 'Delivery', icon: Truck },
    { key: 'payment', label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {step === 'confirmed' ? (
          <div className="max-w-lg mx-auto text-center py-16 space-y-5">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-14 h-14 text-[#4CAF50]" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800">Order Placed Successfully! 🎉</h1>
            <p className="text-gray-500">Your order <span className="font-bold text-[#1E6FD9]">#{orderId}</span> has been placed.</p>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left space-y-3">
              <p className="text-sm text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4 text-[#4CAF50]" /> Estimated delivery: Tomorrow by 6 PM</p>
              <p className="text-sm text-gray-600 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#1E6FD9]" /> All products are 100% genuine</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/orders" className="bg-[#1E6FD9] text-white px-6 py-3 rounded-xl font-bold">Track Order</Link>
              <Link href="/" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50">Back to Home</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Steps Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step Progress */}
              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                {STEPS.map((s, idx) => {
                  const stepKeys = ['address', 'delivery', 'payment'];
                  const currentIdx = stepKeys.indexOf(step);
                  const done = stepKeys.indexOf(s.key) < currentIdx;
                  const active = s.key === step;
                  return (
                    <React.Fragment key={s.key}>
                      <div className={`flex items-center gap-2 flex-1 ${active ? 'text-[#1E6FD9]' : done ? 'text-[#4CAF50]' : 'text-gray-300'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${active ? 'border-[#1E6FD9] bg-blue-50' : done ? 'border-[#4CAF50] bg-green-50' : 'border-gray-200'}`}>
                          {done ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className="text-sm font-semibold hidden sm:block">{s.label}</span>
                      </div>
                      {idx < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Step 1: Address */}
              {step === 'address' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-[#1E6FD9]" /> Delivery Address</h2>
                  <div className="border-2 border-[#1E6FD9] rounded-xl p-4 bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs bg-[#1E6FD9] text-white font-bold px-2 py-0.5 rounded-full">HOME</span>
                        <p className="font-bold text-gray-800 mt-2">Ravi Kumar · 9876543210</p>
                        <p className="text-sm text-gray-600">42, Anna Nagar East, Near Metro Station, Chennai, Tamil Nadu — 600102</p>
                      </div>
                      <button className="text-[#1E6FD9] text-sm font-semibold hover:underline">Change</button>
                    </div>
                  </div>
                  <button onClick={() => setShowAddress(true)} className="w-full border-2 border-dashed border-gray-200 hover:border-[#1E6FD9] text-gray-500 hover:text-[#1E6FD9] py-3 rounded-xl text-sm font-semibold transition-colors">
                    + Add New Address
                  </button>
                  <button onClick={() => setStep('delivery')} className="w-full bg-[#1E6FD9] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    Continue to Delivery <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Delivery */}
              {step === 'delivery' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Truck className="w-5 h-5 text-[#1E6FD9]" /> Delivery Options</h2>
                  <div className="space-y-3">
                    {DELIVERY_OPTIONS.map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryOption === opt.id ? 'border-[#1E6FD9] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="delivery" value={opt.id} checked={deliveryOption === opt.id} onChange={() => setDeliveryOption(opt.id)} className="accent-[#1E6FD9]" />
                        <Truck className={`w-5 h-5 flex-shrink-0 ${deliveryOption === opt.id ? 'text-[#1E6FD9]' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 text-sm">{opt.label}</span>
                            {opt.badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${opt.badge === 'FREE' ? 'bg-green-100 text-[#4CAF50]' : 'bg-orange-100 text-orange-700'}`}>{opt.badge}</span>}
                          </div>
                          <p className="text-xs text-gray-400">{opt.sub}</p>
                        </div>
                        <span className="font-bold text-sm">{opt.price === 0 ? 'FREE' : formatCurrency(opt.price)}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={() => setStep('payment')} className="w-full bg-[#1E6FD9] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 'payment' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#1E6FD9]" /> Payment Method</h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((pm) => (
                      <label key={pm.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === pm.id ? 'border-[#1E6FD9] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-[#1E6FD9]" />
                        <span className="text-2xl">{pm.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{pm.label}</p>
                          <p className="text-xs text-gray-400">{pm.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {paymentMethod === 'upi' && (
                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter your UPI ID (e.g. name@upi)" className="w-full border-2 border-gray-200 focus:border-[#1E6FD9] rounded-xl px-4 py-3 text-sm outline-none" />
                  )}
                  <button onClick={handlePlaceOrder} className="w-full bg-[#4CAF50] hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Place Order — {formatCurrency(tot)}
                  </button>
                  <p className="text-xs text-center text-gray-400">🔒 Secured by 256-bit SSL encryption. Powered by Razorpay.</p>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4 h-fit sticky top-24">
              <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Order Summary</h3>
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/products/medicine_placeholder.svg'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-gray-400 text-xs">×{item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-800 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              {items.length > 3 && <p className="text-xs text-gray-400 text-center">+{items.length - 3} more items</p>}
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(sub)}</span></div>
                {disc > 0 && <div className="flex justify-between text-[#4CAF50] font-semibold"><span>Discount</span><span>−{formatCurrency(disc)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{delivery === 0 ? 'FREE' : formatCurrency(delivery)}</span></div>
                <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-100 pt-2"><span>Total</span><span>{formatCurrency(tot)}</span></div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

