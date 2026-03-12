"use client";

import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Truck, MapPin, CreditCard, Clock, ChevronLeft, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import LoginModal from '../../components/modals/LoginModal';
import AddressModal from '../../components/modals/AddressModal';
import NotificationPanel from '../../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const STATUS_ORDER = ['placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const currentStatusIdx = order ? STATUS_ORDER.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-3xl">
        <Link href="/orders" className="flex items-center gap-2 text-[#1E6FD9] font-semibold text-sm mb-6 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-white rounded-2xl" />
            <div className="h-48 bg-white rounded-2xl" />
          </div>
        ) : !order ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700">Order not found</h2>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Order Header */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order Number</p>
                  <p className="font-mono font-bold text-gray-800">#{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Order Date</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-700">
                    Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            {order.status !== 'cancelled' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#1E6FD9]" /> Order Status
                </h2>
                <div className="relative">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStatusIdx;
                    const active = i === currentStatusIdx;
                    const StepIcon = step.icon;
                    return (
                      <div key={step.key} className="flex items-start gap-4 pb-5 last:pb-0 relative">
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`absolute left-5 top-10 w-0.5 h-full ${done && i < currentStatusIdx ? 'bg-[#4CAF50]' : 'bg-gray-200'}`} />
                        )}
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-[#4CAF50]' : 'bg-gray-100'}`}>
                          <StepIcon className={`w-5 h-5 ${done ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-semibold text-sm ${active ? 'text-[#1E6FD9]' : done ? 'text-gray-800' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          {order.statusTimeline?.find((t: any) => t.status === step.key) && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(order.statusTimeline.find((t: any) => t.status === step.key)?.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4">Items ({order.items?.length})</h2>
              <div className="space-y-3">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.productImage || '/assets/products/medicine_placeholder.svg'}
                        alt=""
                        className="w-full h-full object-contain p-1"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/assets/products/medicine_placeholder.svg'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-gray-400">{item.brand} · ×{item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-800 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount</span><span>−{formatCurrency(order.discount)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span></div>
                <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-100 pt-2"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#1E6FD9]" /> Delivery Address</h2>
              <p className="font-semibold text-gray-800">{order.shippingAddress?.name} · {order.shippingAddress?.phone}</p>
              <p className="text-sm text-gray-600 mt-1">
                {order.shippingAddress?.line1}{order.shippingAddress?.line2 ? `, ${order.shippingAddress.line2}` : ''},{' '}
                {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
              </p>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#1E6FD9]" /> Payment</h2>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod?.toUpperCase()}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <p className="text-xs text-gray-400 mt-1">Payment ID: {order.razorpayPaymentId}</p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 bg-blue-50 rounded-xl px-4 py-3">
              <ShieldCheck className="w-4 h-4 text-[#1E6FD9]" />
              All products are 100% genuine and quality-verified by Nivimeds.
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
