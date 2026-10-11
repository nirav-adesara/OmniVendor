import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Store,
  Users,
  Package,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingUp,
  FileText,
  Search,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    vendors,
    products,
    orders,
    platformStats,
    setVendorStatus,
    navigateToVendorStore,
    resetAllData,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vendors' | 'orders' | 'settings'>('vendors');
  const [vendorSearch, setVendorSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  const filteredVendors = vendors.filter(
    (v) =>
      v.shopName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.city.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const pendingApprovals = vendors.filter((v) => v.status === 'pending');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-24">
      {/* Admin Header in Light Theme */}
      <div className="border-b border-stone-200 bg-white py-8 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Platform Administration & Operations</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              OmniVendor Master Console (Bharat)
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Verify local dukaans, monitor pan-India orders, and configure marketplace parameters
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetAllData}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors border border-stone-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Platform Executive KPIs in Light Theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
              <span>Platform GMV</span>
              <span className="text-emerald-700 font-bold font-mono">₹</span>
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-stone-900 mt-1">
              ₹{platformStats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Avg Order Value: ₹{Math.round(platformStats.averageOrderValue).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
              <span>Verified Dukaans</span>
              <Store className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-stone-900 mt-1">
              {platformStats.totalVendors}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              {platformStats.activeVendors} Active · {pendingApprovals.length} Pending
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
              <span>Listed Products</span>
              <Package className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-stone-900 mt-1">
              {platformStats.totalProducts}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Across all merchant catalogs</div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
              <span>Total Orders Placed</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-stone-900 mt-1">
              {platformStats.totalOrders}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">In-App & WhatsApp orders</div>
          </div>
        </div>
      </div>

      {/* Pending Approval Alert Callout */}
      {pendingApprovals.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>{pendingApprovals.length} Dukaan Application Pending Verification</span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                {pendingApprovals.map((v) => v.shopName).join(', ')} has submitted storefront details and +91 phone number for marketplace approval.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {pendingApprovals.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVendorStatus(v.id, 'active')}
                  className="px-4 py-2 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition-colors shadow-xs"
                >
                  Approve "{v.shopName}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'vendors'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Merchants & Dukaans ({vendors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Master Order Stream ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Marketplace Settings</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Vendors Directory & Approval Actions */}
      {activeTab === 'vendors' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search dukaan name, category, or city..."
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Merchant Dukaan</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Mobile Number</th>
                    <th className="py-3.5 px-4">City / State</th>
                    <th className="py-3.5 px-4">Products</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredVendors.map((vendor) => {
                    const prodCount = products.filter((p) => p.vendorId === vendor.id).length;

                    return (
                      <tr key={vendor.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{vendor.shopName}</div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">{vendor.tagline}</div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-700">{vendor.category}</td>
                        <td className="py-3.5 px-4 font-mono text-stone-800 font-semibold">
                          +91 {vendor.phone}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">{vendor.city}</td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-stone-900 font-bold">
                          {prodCount} items
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              vendor.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : vendor.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {vendor.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigateToVendorStore(vendor.id)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                              title="Preview storefront"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>

                            {vendor.status === 'pending' && (
                              <button
                                onClick={() => setVendorStatus(vendor.id, 'active')}
                                className="px-3 py-1 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
                              >
                                Approve
                              </button>
                            )}

                            {vendor.status === 'active' && (
                              <button
                                onClick={() => setVendorStatus(vendor.id, 'suspended')}
                                className="px-3 py-1 text-xs font-bold bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 rounded-lg transition-colors"
                              >
                                Suspend
                              </button>
                            )}

                            {vendor.status === 'suspended' && (
                              <button
                                onClick={() => setVendorStatus(vendor.id, 'active')}
                                className="px-3 py-1 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg transition-colors"
                              >
                                Re-activate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Master Order Stream */}
      {activeTab === 'orders' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Pan-India Order Audit Stream</h2>
              <p className="text-xs text-stone-500">
                Auditing transactions across all vendor mini-stores
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-white border border-stone-200 rounded-xl text-xs text-stone-800 px-3 py-1.5 focus:outline-hidden focus:border-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending_vendor_review">Pending Review</option>
                <option value="accepted">Accepted</option>
                <option value="preparing">Packing</option>
                <option value="ready_for_pickup_or_delivery">Out for Delivery</option>
                <option value="completed">Delivered</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Dukaan</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items Count</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Channel</th>
                    <th className="py-3.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4 text-amber-800 font-bold">
                        {order.vendorName}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-stone-900 font-semibold">{order.customerName}</div>
                        <div className="text-[11px] text-stone-500">{order.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-stone-900 tabular-nums">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            order.status === 'pending_vendor_review'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : order.status === 'accepted'
                              ? 'bg-sky-100 text-sky-900 border border-sky-200'
                              : order.status === 'preparing'
                              ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                              : order.status === 'ready_for_pickup_or_delivery'
                              ? 'bg-teal-100 text-teal-900 border border-teal-200'
                              : order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-rose-100 text-rose-900 border border-rose-200'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {order.sentViaWhatsApp ? (
                          <span className="text-emerald-700 font-bold">WhatsApp</span>
                        ) : (
                          <span className="text-stone-500">In-App</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Platform Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Platform Parameters</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Indian commerce take-rate, SMS gateway, and WhatsApp deep links
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-800">Default Merchant Take-Rate</div>
                  <div className="text-stone-500 mt-0.5">Platform commission on successful orders</div>
                </div>
                <div className="font-mono text-base font-black text-amber-700">4.5%</div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-800">Indian Mobile SMS OTP Engine</div>
                  <div className="text-stone-500 mt-0.5">+91 DLT Registered SMS Gateway / Firebase Auth</div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-800 font-bold font-mono">
                  +91 SMS Enabled
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-800">WhatsApp Commerce Integration</div>
                  <div className="text-stone-500 mt-0.5">wa.me direct deep link with itemized Hindi/English cart inquiry</div>
                </div>
                <div className="text-emerald-700 font-bold">Active & Enforced</div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-150 flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-stone-900">Reset Demo Database</div>
                <div className="text-[11px] text-stone-500">Restore default Indian merchants, items, and orders</div>
              </div>
              <button
                onClick={resetAllData}
                className="px-4 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors border border-stone-200"
              >
                Reset Demo State
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
