import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  MessageCircle,
  ArrowRight,
  Store,
} from 'lucide-react';

export const CustomerOrdersView: React.FC = () => {
  const { orders, currentUser, navigateToMarketplace, navigateToVendorStore } = useApp();

  const customerOrders = orders.filter((o) => {
    if (!currentUser) return true;
    return o.customerId === currentUser.id || o.customerName === currentUser.name;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_vendor_review':
        return (
          <span className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
            <Package className="w-3.5 h-3.5" />
            <span>Packing Items</span>
          </span>
        );
      case 'ready_for_pickup_or_delivery':
        return (
          <span className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            <Truck className="w-3.5 h-3.5" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'declined':
        return (
          <span className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Declined</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-stone-900">
              My Orders & Dukaan Inquiries
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Track real-time fulfillment status across individual vendor storefronts
            </p>
          </div>
          <button
            onClick={navigateToMarketplace}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors"
          >
            <span>Back to Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Orders List */}
        {customerOrders.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
            <Package className="w-12 h-12 mx-auto text-stone-300" />
            <h2 className="text-lg font-bold text-stone-800">No Orders Sent Yet</h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Once you send an order inquiry or cart checkout to a vendor, it will appear here with live tracking.
            </p>
            <button
              onClick={navigateToMarketplace}
              className="px-4 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors"
            >
              Browse Merchant Catalogs
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {customerOrders.map((order) => {
              const cleanPhone = order.vendorPhone.replace(/\D/g, '');
              const waFollowUpUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                `Namaste ${order.vendorName}, following up regarding my Order #${order.id}. Could you please confirm expected delivery time?`
              )}`;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-150">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-stone-900">
                          #{order.id}
                        </span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <button
                          onClick={() => navigateToVendorStore(order.vendorId)}
                          className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline"
                        >
                          <Store className="w-3.5 h-3.5" />
                          <span>{order.vendorName}</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <a
                        href={waFollowUpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Items Breakdown */}
                  <div className="space-y-2 text-xs">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1 border-b border-stone-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-stone-500">{item.quantity}x</span>
                          <span className="text-stone-800 font-medium">{item.name}</span>
                          <span className="text-stone-400 text-[11px]">({item.unit})</span>
                        </div>
                        <div className="font-mono font-bold text-stone-900 tabular-nums">
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Notes */}
                  <div className="pt-3 border-t border-stone-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-stone-600">
                      <span className="text-stone-400 font-medium">Destination:</span> {order.deliveryAddress}
                      {order.customerNotes && (
                        <div className="text-[11px] text-amber-800 mt-0.5 font-medium">
                          Instructions: "{order.customerNotes}"
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-stone-500 mr-2 font-medium">Total:</span>
                      <span className="text-base font-black font-mono tabular-nums text-stone-900">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
