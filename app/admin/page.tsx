"use client";
import React, { useState } from 'react';
import { BarChart3, Package, ShoppingBag, Users, TrendingUp, Settings, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import { PRODUCTS } from '../../lib/mockData';
import { formatCurrency } from '../../lib/utils';

const Link = ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>;

const STATS = [
  { label: 'Total Revenue', value: '₹4,82,340', change: '+12.3%', up: true, icon: TrendingUp, color: 'text-[#4CAF50] bg-green-50' },
  { label: 'Total Orders', value: '1,284', change: '+8.1%', up: true, icon: ShoppingBag, color: 'text-[#1E6FD9] bg-blue-50' },
  { label: 'Active Products', value: PRODUCTS.length.toString(), change: '+3', up: true, icon: Package, color: 'text-purple-600 bg-purple-50' },
  { label: 'Registered Users', value: '8,932', change: '+15.2%', up: true, icon: Users, color: 'text-orange-600 bg-orange-50' },
];

const MOCK_ORDERS = [
  { id: 'NV87654325', user: 'Ravi Kumar', amount: 724, status: 'Delivered', date: '2026-03-10', items: 3 },
  { id: 'NV87654324', user: 'Priya S.', amount: 349, status: 'Out for Delivery', date: '2026-03-10', items: 1 },
  { id: 'NV87654323', user: 'Arjun M.', amount: 1450, status: 'Confirmed', date: '2026-03-09', items: 4 },
  { id: 'NV87654322', user: 'Meera R.', amount: 899, status: 'Packed', date: '2026-03-09', items: 2 },
  { id: 'NV87654321', user: 'Suresh K.', amount: 250, status: 'Order Placed', date: '2026-03-08', items: 2 },
];

const STATUS_COLORS: Record<string, string> = {
  'Delivered': 'bg-green-100 text-[#4CAF50]',
  'Out for Delivery': 'bg-orange-100 text-orange-700',
  'Confirmed': 'bg-blue-100 text-[#1E6FD9]',
  'Packed': 'bg-purple-100 text-purple-700',
  'Order Placed': 'bg-gray-100 text-gray-700',
};

const NAV = [
  { label: 'Dashboard', icon: BarChart3, active: true },
  { label: 'Products', icon: Package },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Customers', icon: Users },
  { label: 'Settings', icon: Settings },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 flex flex-col border-r border-gray-800 sticky top-0 h-screen hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1E6FD9] rounded-lg flex items-center justify-center font-extrabold text-sm">N</div>
            <div>
              <p className="font-bold text-white text-sm">Nivimeds</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <button key={item.label}
              onClick={() => { setActiveNav(item.label); if (['Dashboard', 'Products', 'Orders'].includes(item.label)) setTab(item.label.toLowerCase() as any); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeNav === item.label ? 'bg-[#1E6FD9] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800">
            <LogOut className="w-4 h-4" /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-white">{activeNav}</h1>
            <p className="text-gray-400 text-sm mt-0.5">Welcome back, Admin · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>

          {tab === 'dashboard' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.up ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>{s.change}</span>
                    </div>
                    <p className="text-2xl font-extrabold text-white">{s.value}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h2 className="font-bold text-white mb-4">Revenue Overview (March 2026)</h2>
                <div className="flex items-end gap-3 h-40">
                  {[65, 40, 75, 55, 80, 60, 90, 45, 70, 85, 50, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-[#1E6FD9] rounded-t-lg transition-all hover:bg-blue-500" style={{ height: `${h}%` }} />
                      <span className="text-[9px] text-gray-500">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex justify-between mb-4">
                  <h2 className="font-bold text-white">Recent Orders</h2>
                  <button onClick={() => { setActiveNav('Orders'); setTab('orders'); }} className="text-[#1E6FD9] text-xs font-semibold hover:underline">View all</button>
                </div>
                <OrdersTable orders={MOCK_ORDERS} />
              </div>
            </>
          )}

          {tab === 'products' && (
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-white">Products ({PRODUCTS.length})</h2>
                <button className="flex items-center gap-2 bg-[#1E6FD9] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      {['Product', 'Brand', 'Category', 'Price', 'MRP', 'Stock'].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-gray-400 font-semibold text-xs uppercase">{h}</th>
                      ))}
                      <th className="text-right py-3 px-4 text-gray-400 font-semibold text-xs uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map((p) => (
                      <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">{p.name.slice(0, 30)}{p.name.length > 30 ? '…' : ''}</td>
                        <td className="py-3 px-4 text-gray-400">{p.brand}</td>
                        <td className="py-3 px-4 text-gray-400">{p.subcategory || p.category}</td>
                        <td className="py-3 px-4 text-[#4CAF50] font-bold">{formatCurrency(p.price)}</td>
                        <td className="py-3 px-4 text-gray-400">{formatCurrency(p.mrp)}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.inStock ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                            {p.inStock ? 'In Stock' : 'OOS'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button className="text-gray-400 hover:text-[#1E6FD9] transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
              <h2 className="font-bold text-white">All Orders</h2>
              <OrdersTable orders={MOCK_ORDERS} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function OrdersTable({ orders }: { orders: typeof MOCK_ORDERS }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {['Order ID', 'Customer', 'Items', 'Amount', 'Date', 'Status'].map((h) => (
              <th key={h} className="text-left py-3 px-3 text-gray-400 font-semibold text-xs uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
              <td className="py-3 px-3 font-mono text-[#1E6FD9] font-bold">{o.id}</td>
              <td className="py-3 px-3 text-white">{o.user}</td>
              <td className="py-3 px-3 text-gray-400">{o.items} items</td>
              <td className="py-3 px-3 font-bold text-white">{formatCurrency(o.amount)}</td>
              <td className="py-3 px-3 text-gray-400">{o.date}</td>
              <td className="py-3 px-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
