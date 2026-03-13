"use client";

import React, { useState, useEffect } from 'react';
import { Package, ChevronRight, Clock, CheckCircle, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../lib/utils';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  placed: { label: 'Order Placed', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: ShoppingBag },
  confirmed: { label: 'Confirmed', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle },
  packed: { label: 'Packed', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Package },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100', icon: Package },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const { isLoggedIn, user } = useUserStore();

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    fetch('/api/orders', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-[#1E6FD9]" /> My Orders
        </h1>

        {!isLoggedIn ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Login to view your orders</h2>
            <p className="text-gray-400 mb-6">Track your orders and view order history after logging in.</p>
            <button onClick={() => setShowLogin(true)} className="inline-flex items-center gap-2 bg-[#1E6FD9] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              Login Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here.</p>
            <Link href="/medicines" className="inline-flex items-center gap-2 bg-[#1E6FD9] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              Browse Medicines <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
              const StatusIcon = statusConfig.icon;
              return (
                <div key={order._id} className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" /> {statusConfig.label}
                        </span>
                      </div>
                      <p className="font-mono text-sm font-bold text-gray-600">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-lg">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
                    {order.items?.slice(0, 4).map((item: any, i: number) => (
                      <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                        <div className="w-8 h-8 flex-shrink-0">
                          <img
                            src={item.productImage || '/assets/products/medicine_placeholder.svg'}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/products/medicine_placeholder.svg'; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.productName}</p>
                          <p className="text-xs text-gray-400">×{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {(order.items?.length || 0) > 4 && (
                      <div className="flex-shrink-0 flex items-center px-3 py-2 bg-gray-50 rounded-xl text-xs text-gray-500 font-semibold">
                        +{order.items.length - 4} more
                      </div>
                    )}
                  </div>

                  {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <Clock className="w-3 h-3 text-[#4CAF50]" />
                      Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="flex items-center gap-1 text-[#1E6FD9] text-sm font-semibold hover:underline"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
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
