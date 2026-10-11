import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Vendor, Order, OrderStatus } from '../../types';
import {
  Store,
  Package,
  Plus,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  MessageCircle,
  Edit2,
  Trash2,
  Save,
  X,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  Sliders,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const {
    currentUser,
    currentVendor,
    vendors,
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateVendorProfile,
    updateOrderStatus,
    switchDemoUser,
    openOtpModal,
    showToast,
  } = useApp();

  // If user is not logged in as a vendor, select the first active vendor for demo exploration
  const activeVendor: Vendor | null = currentVendor || vendors[0] || null;

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'profile' | 'whatsapp_preview'>('orders');

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: 150,
    unit: '',
    description: '',
    inventoryCount: 20,
    stockStatus: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock',
    tags: '',
  });

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    shopName: activeVendor?.shopName || '',
    tagline: activeVendor?.tagline || '',
    category: activeVendor?.category || '',
    phone: activeVendor?.phone || '',
    address: activeVendor?.address || '',
    city: activeVendor?.city || '',
    openingHours: activeVendor?.openingHours || '',
    deliveryFee: activeVendor?.deliveryFee || 40,
    minOrder: activeVendor?.minOrder || 250,
    description: activeVendor?.description || '',
  });

  const vendorProducts = useMemo(() => {
    if (!activeVendor) return [];
    return products.filter((p) => p.vendorId === activeVendor.id);
  }, [products, activeVendor]);

  const vendorOrders = useMemo(() => {
    if (!activeVendor) return [];
    return orders.filter((o) => o.vendorId === activeVendor.id);
  }, [orders, activeVendor]);

  const pendingOrdersCount = vendorOrders.filter(
    (o) => o.status === 'pending_vendor_review'
  ).length;

  const totalStoreRevenue = vendorOrders
    .filter((o) => o.status === 'completed' || o.status === 'accepted' || o.status === 'preparing')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: activeVendor?.category || 'Specialty Items',
      price: 250,
      unit: '500g box',
      description: '',
      inventoryCount: 30,
      stockStatus: 'in_stock',
      tags: 'Fresh, Best Quality',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      unit: prod.unit,
      description: prod.description,
      inventoryCount: prod.inventoryCount,
      stockStatus: prod.stockStatus,
      tags: prod.tags.join(', '),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVendor) return;

    if (!productForm.name.trim()) {
      showToast('Product name is required');
      return;
    }

    const tagsArray = productForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        unit: productForm.unit,
        description: productForm.description,
        inventoryCount: Number(productForm.inventoryCount),
        stockStatus: productForm.stockStatus,
        tags: tagsArray,
      });
    } else {
      addProduct({
        vendorId: activeVendor.id,
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        unit: productForm.unit,
        description: productForm.description,
        inventoryCount: Number(productForm.inventoryCount),
        stockStatus: productForm.stockStatus,
        tags: tagsArray,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVendor) return;

    updateVendorProfile(activeVendor.id, {
      shopName: profileForm.shopName,
      tagline: profileForm.tagline,
      category: profileForm.category,
      phone: profileForm.phone,
      address: profileForm.address,
      city: profileForm.city,
      openingHours: profileForm.openingHours,
      deliveryFee: Number(profileForm.deliveryFee),
      minOrder: Number(profileForm.minOrder),
      description: profileForm.description,
    });
    setIsEditingProfile(false);
  };

  if (!activeVendor) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 p-8 flex flex-col items-center justify-center">
        <Store className="w-12 h-12 text-stone-400 mb-4" />
        <h2 className="text-xl font-bold">No Vendor Profile Active</h2>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          Sign in using a merchant mobile number to access your Vyapar portal.
        </p>
        <button
          onClick={() => openOtpModal('vendor')}
          className="px-5 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs"
        >
          Vendor Mobile Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-24">
      {/* Vendor Top Banner in Light Theme */}
      <div className="border-b border-stone-200 bg-white py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-stone-900 tracking-tight">
                  {activeVendor.shopName}
                </h1>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    activeVendor.status === 'active'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {activeVendor.status === 'active' ? 'Verified Dukaan' : 'Verification Pending'}
                </span>
              </div>
              <div className="text-xs text-stone-500 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  +91 {activeVendor.phone}
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {activeVendor.city}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Merchant Switcher */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-stone-500 mr-1 hidden lg:block font-medium">Switch Dukaan:</div>
            <button
              onClick={() => switchDemoUser('user-vendor-1')}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                activeVendor.id === 'vendor-1'
                  ? 'bg-amber-500 text-stone-950 font-bold border-amber-500'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              Anand Sweets
            </button>
            <button
              onClick={() => switchDemoUser('user-vendor-2')}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                activeVendor.id === 'vendor-2'
                  ? 'bg-amber-500 text-stone-950 font-bold border-amber-500'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              Malabar Coffee
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip in Light Theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-semibold text-stone-500">Incoming Orders</div>
            <div className="text-2xl font-black font-mono tabular-nums text-stone-900 mt-1">
              {vendorOrders.length}
            </div>
            <div className="text-[11px] text-amber-700 font-bold mt-1">
              {pendingOrdersCount} awaiting confirmation
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-semibold text-stone-500">Catalog Products</div>
            <div className="text-2xl font-black font-mono tabular-nums text-stone-900 mt-1">
              {vendorProducts.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Active items on shelf</div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-semibold text-stone-500">Total Store Sales</div>
            <div className="text-2xl font-black font-mono tabular-nums text-stone-900 mt-1">
              ₹{totalStoreRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">Gross order inquiries</div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-semibold text-stone-500">Dukaan Rating</div>
            <div className="text-2xl font-black font-mono tabular-nums text-stone-900 mt-1">
              {activeVendor.rating} ★
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {activeVendor.reviewCount} customer reviews
            </div>
          </div>
        </div>
      </div>

      {/* Portal Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Customer Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center text-[10px] rounded-full bg-stone-900 text-white font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'products'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Manage Products ({vendorProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Dukaan Profile & WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp_preview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'whatsapp_preview'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Order Preview</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Incoming Orders Stream */}
      {activeTab === 'orders' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Incoming Orders Stream</h2>
              <p className="text-xs text-stone-500">
                Accept orders, mark packing status, or chat with buyers directly on WhatsApp
              </p>
            </div>
          </div>

          {vendorOrders.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 shadow-xs">
              <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-bold text-stone-800">No Orders in Inbox</p>
              <p className="text-xs text-stone-500 mt-1">
                When customers place an order or send a WhatsApp inquiry, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorOrders.map((order) => {
                const customerWaUrl = `https://wa.me/91${order.customerPhone.replace(
                  /\D/g,
                  ''
                ).slice(-10)}?text=${encodeURIComponent(
                  `Namaste ${order.customerName}, this is ${activeVendor.shopName} regarding your Order #${order.id}.`
                )}`;

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-150">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-base text-stone-900">
                            #{order.id}
                          </span>
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
                          {order.sentViaWhatsApp && (
                            <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                              Via WhatsApp
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          Customer: <strong className="text-stone-900">{order.customerName}</strong> ({order.customerPhone}) · {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={customerWaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Buyer</span>
                        </a>
                      </div>
                    </div>

                    {/* Items and Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                          Items Ordered
                        </div>
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between py-1 border-b border-stone-100"
                          >
                            <span className="text-stone-800">
                              {it.quantity}x {it.name} ({it.unit})
                            </span>
                            <span className="font-mono text-stone-900 font-bold">
                              ₹{it.totalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
                        <div>
                          <span className="text-stone-400 block text-[11px] font-medium">Delivery Address</span>
                          <span className="text-stone-800 font-semibold">{order.deliveryAddress}</span>
                        </div>
                        {order.customerNotes && (
                          <div>
                            <span className="text-stone-400 block text-[11px] font-medium">Customer Note</span>
                            <span className="text-amber-900 font-medium italic">"{order.customerNotes}"</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm">
                          <span className="text-stone-900">Total Amount</span>
                          <span className="font-mono text-stone-950 font-black">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Lifecycle Action Buttons */}
                    <div className="pt-3 border-t border-stone-150 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-medium text-stone-500">Order Progress:</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {order.status === 'pending_vendor_review' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'accepted')}
                              className="px-3.5 py-1.5 text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 rounded-xl transition-colors"
                            >
                              Accept Order
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'declined')}
                              className="px-3.5 py-1.5 text-xs font-bold bg-stone-100 text-rose-700 hover:bg-stone-200 rounded-xl transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {order.status === 'accepted' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl transition-colors"
                          >
                            Mark Packing
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, 'ready_for_pickup_or_delivery')
                            }
                            className="px-3.5 py-1.5 text-xs font-bold bg-teal-600 text-white hover:bg-teal-500 rounded-xl transition-colors"
                          >
                            Mark Out for Delivery
                          </button>
                        )}

                        {order.status === 'ready_for_pickup_or_delivery' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}

                        {order.status === 'completed' && (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Fulfilled & Delivered</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Product Catalog CRUD */}
      {activeTab === 'products' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Dukaan Product Catalog</h2>
              <p className="text-xs text-stone-500">
                Add new items, update prices in ₹, and control stock availability
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vendorProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-300 transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="text-amber-800 font-bold">{prod.category}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                        prod.stockStatus === 'in_stock'
                          ? 'text-emerald-800 bg-emerald-50'
                          : prod.stockStatus === 'low_stock'
                          ? 'text-amber-800 bg-amber-50'
                          : 'text-rose-800 bg-rose-50'
                      }`}
                    >
                      {prod.stockStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900">{prod.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{prod.description}</p>

                  <div className="mt-3 flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <span>
                      Inventory: <span className="font-mono text-stone-900 font-bold">{prod.inventoryCount}</span>
                    </span>
                    <span>
                      Unit: <span className="font-mono text-stone-800">{prod.unit}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-150 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-stone-400 font-medium">Price</div>
                    <div className="text-base font-black font-mono tabular-nums text-stone-900">
                      ₹{prod.price}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="p-2 bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-700 rounded-xl transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Store Profile & Policies */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-150 mb-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Dukaan Settings & WhatsApp</h2>
                <p className="text-xs text-stone-500">
                  Update your business name, WhatsApp order recipient phone number, and minimum delivery amount
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-3.5 py-1.5 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors"
              >
                {isEditingProfile ? 'Cancel Edit' : 'Edit Details'}
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dukaan / Shop Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={profileForm.shopName}
                    onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Primary Category
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={profileForm.category}
                    onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2 disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp Orders 10-Digit Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs bg-stone-100 border border-r-0 border-stone-200 rounded-l-xl text-stone-600 font-bold">
                      +91
                    </span>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-r-xl px-3 py-2 disabled:opacity-60 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Daily Timings
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={profileForm.openingHours}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, openingHours: e.target.value })
                    }
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery Charge (₹)
                  </label>
                  <input
                    type="number"
                    step="5"
                    disabled={!isEditingProfile}
                    value={profileForm.deliveryFee}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, deliveryFee: Number(e.target.value) })
                    }
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2 disabled:opacity-60 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="50"
                    disabled={!isEditingProfile}
                    value={profileForm.minOrder}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, minOrder: Number(e.target.value) })
                    }
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2 disabled:opacity-60 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Shop Story & Description
                </label>
                <textarea
                  rows={3}
                  disabled={!isEditingProfile}
                  value={profileForm.description}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, description: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2 disabled:opacity-60"
                />
              </div>

              {isEditingProfile && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Dukaan Profile</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: WhatsApp Inquiry Simulator */}
      {activeTab === 'whatsapp_preview' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Commerce</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900">
                Customer Orders Directly on Your WhatsApp
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                When customers tap "Send via WhatsApp", they automatically send a neatly formatted message to your mobile number{' '}
                <strong className="text-stone-900 font-mono">+91 {activeVendor.phone}</strong>.
              </p>
            </div>

            {/* Simulated WhatsApp Phone Frame in clean light theme */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 font-sans">
              <div className="flex items-center gap-3 pb-3 border-b border-emerald-200 text-xs text-emerald-900">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold">Live WhatsApp Incoming Message Preview:</span>
              </div>

              <div className="mt-4 p-4 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-stone-900 leading-relaxed whitespace-pre-line shadow-xs">
{`🛍️ *NEW ORDER INQUIRY - OmniVendor*
*Order ID:* #ORD-5102
*Customer:* Priya Desai
*Phone:* +91 98250 33001
*Delivery Address:* 402 Galaxy Heights, Near Sindhu Bhavan Road, Bodakdev, Ahmedabad - 380054
*Special Instructions:* Please pack in festive gift box

*Ordered Items:*
• 2x Shuddh Kaju Katli (500g box) - ₹980
• 2x Special Ratlami Sev (400g pack) - ₹360

*Subtotal:* ₹1,340
*Delivery Fee:* ₹40
*Grand Total:* ₹1,380

Kindly confirm order acceptance and estimated delivery time. Dhanyavaad!`}
              </div>

              <div className="mt-4 text-[11px] text-stone-500 flex items-center justify-between">
                <span>Direct Deep Link: <code className="text-stone-800 font-bold">wa.me/91{activeVendor.phone}</code></span>
                <span className="text-emerald-700 font-bold">Zero Platform Commission</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl p-6 text-stone-900">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-stone-900 mb-1">
              {editingProductId ? 'Edit Product' : 'Add New Item to Dukaan'}
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Specify item details, price in ₹, packaging unit, and stock count.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product / Item Name
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Kesar Pista Peda / Cold Pressed Sesame Oil"
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    placeholder="e.g. Mithai, Namkeen, Spices"
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Unit Specification
                  </label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="e.g. 500g box, 1 liter bottle"
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Stock Inventory Count
                  </label>
                  <input
                    type="number"
                    value={productForm.inventoryCount}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        inventoryCount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Stock Status
                </label>
                <select
                  value={productForm.stockStatus}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      stockStatus: e.target.value as any,
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="in_stock">In Stock (उपलब्ध)</option>
                  <option value="low_stock">Low Stock (सीमित)</option>
                  <option value="out_of_stock">Out of Stock (समाप्त)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Fresh ingredients, shelf life, pure desi ghee, etc."
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={productForm.tags}
                  onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                  placeholder="Pure Ghee, Festival Special, Organic"
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl shadow-xs"
                >
                  {editingProductId ? 'Update Item' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
