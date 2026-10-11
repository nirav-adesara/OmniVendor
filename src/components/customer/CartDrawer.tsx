import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Store,
  Send,
  MessageCircle,
  Copy,
  Check,
  MapPin,
  Phone,
  User as UserIcon,
  FileText,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    groupedCart,
    updateCartQuantity,
    removeFromCart,
    clearVendorCart,
    createOrder,
    generateWhatsAppLink,
    currentUser,
    navigateToOrders,
    showToast,
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.name || 'Priya Desai');
  const [customerPhone, setCustomerPhone] = useState(
    currentUser ? `${currentUser.countryCode} ${currentUser.phone}` : '+91 98250 33001'
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    '402 Galaxy Heights, Near Sindhu Bhavan Road, Bodakdev, Ahmedabad - 380054'
  );
  const [customerNotes, setCustomerNotes] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const vendorIds = Object.keys(groupedCart);

  const handleSendInternalOrder = (vendorId: string) => {
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      showToast('Please provide your name, phone, and delivery address.');
      return;
    }

    const order = createOrder({
      vendorId,
      customerName,
      customerPhone,
      deliveryAddress,
      customerNotes,
      sentViaWhatsApp: false,
    });

    if (order) {
      onClose();
      navigateToOrders();
    }
  };

  const handleSendWhatsAppOrder = (vendorId: string) => {
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      showToast('Please provide your name, phone, and delivery address.');
      return;
    }

    const order = createOrder({
      vendorId,
      customerName,
      customerPhone,
      deliveryAddress,
      customerNotes,
      sentViaWhatsApp: true,
    });

    if (order) {
      const waUrl = generateWhatsAppLink(order);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      onClose();
      navigateToOrders();
    }
  };

  const copyWhatsAppText = (vendorId: string) => {
    const group = groupedCart[vendorId];
    if (!group) return;

    const mockOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser?.id || 'guest',
      customerName,
      customerPhone,
      deliveryAddress,
      customerNotes,
      vendorId: group.vendor.id,
      vendorName: group.vendor.shopName,
      vendorPhone: `${group.vendor.countryCode} ${group.vendor.phone}`,
      items: group.items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        unitPrice: i.product.price,
        quantity: i.quantity,
        totalPrice: i.product.price * i.quantity,
        unit: i.product.unit,
      })),
      subtotal: group.subtotal,
      deliveryFee: group.deliveryFee,
      totalAmount: group.total,
      status: 'pending_vendor_review',
      sentViaWhatsApp: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const link = generateWhatsAppLink(mockOrder);
    const decodedMessage = decodeURIComponent(link.split('text=')[1] || '');
    navigator.clipboard.writeText(decodedMessage);
    setCopiedOrderId(vendorId);
    showToast('WhatsApp order inquiry copied to clipboard!');
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-xl bg-white border-l border-stone-200 text-stone-900 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Grouped Dukaan Cart
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {vendorIds.length === 0 ? (
            <div className="py-16 text-center text-stone-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-300" />
              <p className="text-base font-bold text-stone-700">Your cart is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore merchant mini-stores and add your favorite provisions.
              </p>
            </div>
          ) : (
            <>
              {/* Delivery Details Form (Indian Customer Inputs) */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                  Delivery Details & Contact
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Recipient Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                        placeholder="Priya Desai"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Contact Mobile (WhatsApp)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500 font-mono"
                        placeholder="+91 98250 33001"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Street Address & Landmark
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                      placeholder="Flat/House No, Society, Landmark, City & PIN"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Special Packaging / Notes
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                      placeholder="e.g. Please pack in festival gift box; ring bell twice"
                    />
                  </div>
                </div>
              </div>

              {/* Grouped Vendor Packages */}
              <div className="space-y-5">
                {vendorIds.map((vId) => {
                  const group = groupedCart[vId];
                  if (!group) return null;

                  return (
                    <div
                      key={vId}
                      className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4"
                    >
                      {/* Package Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-amber-700" />
                          <h3 className="font-bold text-sm text-stone-900">{group.vendor.shopName}</h3>
                        </div>
                        <button
                          onClick={() => clearVendorCart(vId)}
                          className="text-[11px] text-stone-400 hover:text-red-600 transition-colors"
                        >
                          Clear Dukaan
                        </button>
                      </div>

                      {/* Items List */}
                      <div className="space-y-3">
                        {group.items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-stone-900 truncate">
                                {item.product.name}
                              </div>
                              <div className="text-[11px] text-stone-500 font-mono">
                                ₹{item.product.price} / {item.product.unit}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg p-0.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCartQuantity(item.product.id, item.quantity - 1)
                                  }
                                  className="p-1 text-stone-600 hover:text-stone-900"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center font-mono font-bold text-stone-900 text-xs">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCartQuantity(item.product.id, item.quantity + 1)
                                  }
                                  className="p-1 text-stone-600 hover:text-stone-900"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="w-16 text-right font-mono font-bold text-stone-900 tabular-nums">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financial Breakdown */}
                      <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs">
                        <div className="flex justify-between text-stone-600">
                          <span>Items Subtotal</span>
                          <span className="font-mono tabular-nums font-semibold">
                            ₹{group.subtotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Local Delivery Charge</span>
                          <span className="font-mono tabular-nums font-semibold">
                            ₹{group.deliveryFee.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-stone-100">
                          <span>Store Package Total</span>
                          <span className="font-mono tabular-nums text-stone-950 font-black">
                            ₹{group.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* "Send to Vendor" Actions */}
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Option 1: Send via Internal System */}
                        <button
                          onClick={() => handleSendInternalOrder(vId)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send In-App Order</span>
                        </button>

                        {/* Option 2: Send via WhatsApp Deep Link */}
                        <button
                          onClick={() => handleSendWhatsAppOrder(vId)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition-colors shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Send via WhatsApp</span>
                        </button>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => copyWhatsAppText(vId)}
                          className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 transition-colors font-medium"
                        >
                          {copiedOrderId === vId ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied text!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy WhatsApp Order Message</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
