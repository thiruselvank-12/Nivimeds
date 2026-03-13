"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Truck, CreditCard, CheckCircle, ChevronRight, ArrowRight, ShieldCheck, Clock, Plus, Loader2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useUserStore } from '../../store/userStore';
import { formatCurrency, generateOrderId } from '../../lib/utils';
import { paymentsApi, ordersApi, addressesApi } from '../../lib/apiClient';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

type Step = 'address' | 'delivery' | 'payment' | 'confirmed';
const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', sub: 'Delivered by tomorrow', price: 0, badge: 'FREE' },
  { id: 'express', label: 'Express Delivery', sub: 'Delivered in 3-4 hours', price: 79, badge: 'FAST' },
  { id: 'schedule', label: 'Scheduled Delivery', sub: 'Choose your time slot', price: 29, badge: null },
];

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Online Payment', sub: 'UPI, Card, NetBanking, Wallet', icon: '💳' },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
];

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('address');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);

  const { items, subtotal, discount, deliveryFee, total, clearCart } = useCartStore();
  const { user, isLoggedIn } = useUserStore();

  const sub = subtotal();
  const disc = discount();
  const delivery = deliveryOption === 'standard' ? deliveryFee() : deliveryOption === 'express' ? 79 : 29;
  const tot = sub - disc + delivery;

  useEffect(() => {
    if (isLoggedIn && user?.addresses) {
      setAddresses(user.addresses);
      const defaultAddr = user.addresses.find((a: any) => a.isDefault) || user.addresses[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr._id || defaultAddr.id || '');
    }
  }, [isLoggedIn, user]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const getSelectedAddress = () => {
    return addresses.find((a: any) => (a._id || a.id) === selectedAddressId) || addresses[0] || null;
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) { setShowLogin(true); return; }
    const address = getSelectedAddress();
    if (!address) { setError('Please select a delivery address'); return; }

    setError('');
    setLoading(true);

    const orderData = {
      items: items.map((i) => ({
        productId: i.id,
        productName: i.name,
        productImage: i.image,
        brand: i.brand || '',
        unit: i.unit,
        quantity: i.quantity,
        price: i.price,
        mrp: i.mrp,
      })),
      shippingAddress: {
        name: address.name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      paymentMethod,
      subtotal: sub,
      discount: disc,
      deliveryFee: delivery,
      total: tot,
    };

    try {
      if (paymentMethod === 'cod') {
        const { data } = await ordersApi.create(orderData);
        setConfirmedOrderId(data.order.orderNumber);
        clearCart();
        setStep('confirmed');
      } else {
        // Razorpay online payment
        const { data: rzpData } = await paymentsApi.createOrder(tot);

        const options = {
          key: rzpData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: rzpData.amount,
          currency: 'INR',
          name: 'Nivimeds',
          description: 'Healthcare Order',
          order_id: rzpData.orderId,
          prefill: {
            name: user?.name,
            contact: `+91${user?.phone}`,
            email: user?.email,
          },
          theme: { color: '#1E6FD9' },
          handler: async (response: any) => {
            try {
              // Verify payment
              await paymentsApi.verify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              // Create order in DB
              const { data: order } = await ordersApi.create({
                ...orderData,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
              });

              setConfirmedOrderId(order.order.orderNumber);
              clearCart();
              setStep('confirmed');
            } catch {
              setError('Payment verification failed. Please contact support.');
            }
            setLoading(false);
          },
          modal: {
            ondismiss: () => { setLoading(false); },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return; // Don't set loading false here — it's handled in handler/ondismiss
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      if (paymentMethod === 'cod') setLoading(false);
    }
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
            <p className="text-gray-500">Your order <span className="font-bold text-[#1E6FD9]">#{confirmedOrderId}</span> has been placed.</p>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left space-y-3">
              <p className="text-sm text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4 text-[#4CAF50]" /> Estimated delivery: Tomorrow by 6 PM</p>
              <p className="text-sm text-gray-600 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#1E6FD9]" /> All products are 100% genuine</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href={`/orders/${confirmedOrderId}`} className="bg-[#1E6FD9] text-white px-6 py-3 rounded-xl font-bold">Track Order</Link>
              <Link href="/" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50">Back to Home</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

              {/* Address Step */}
              {step === 'address' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-[#1E6FD9]" /> Delivery Address</h2>
                  {!isLoggedIn ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">Login to use your saved addresses</p>
                      <button onClick={() => setShowLogin(true)} className="bg-[#1E6FD9] text-white px-6 py-2 rounded-xl font-bold">Login</button>
                    </div>
                  ) : addresses.length === 0 ? (
                    <p className="text-gray-400 text-sm">No addresses found. Add a new address below.</p>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr: any) => {
                        const id = addr._id || addr.id;
                        return (
                          <label key={id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedAddressId === id ? 'border-[#1E6FD9] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="address" checked={selectedAddressId === id} onChange={() => setSelectedAddressId(id)} className="mt-1 accent-[#1E6FD9]" />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-[#1E6FD9] text-white font-bold px-2 py-0.5 rounded-full">{addr.label?.toUpperCase()}</span>
                                {addr.isDefault && <span className="text-xs text-green-600 font-semibold">Default</span>}
                              </div>
                              <p className="font-bold text-gray-800 text-sm">{addr.name} · {addr.phone}</p>
                              <p className="text-sm text-gray-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} — {addr.pincode}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  <button onClick={() => setShowAddress(true)} className="w-full border-2 border-dashed border-gray-200 hover:border-[#1E6FD9] text-gray-500 hover:text-[#1E6FD9] py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Address
                  </button>
                  <button onClick={() => setStep('delivery')} className="w-full bg-[#1E6FD9] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    Continue to Delivery <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Delivery Step */}
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

              {/* Payment Step */}
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
                  {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-[#4CAF50] hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    {loading ? 'Processing...' : `Place Order — ${formatCurrency(tot)}`}
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
