import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  Vendor,
  Product,
  CartItem,
  Order,
  OrderStatus,
  PlatformStats,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
} from '../data/initialData';

interface GroupedCartVendor {
  vendor: Vendor;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

interface AppContextType {
  // Auth state
  currentUser: User | null;
  currentRole: UserRole;
  isOtpModalOpen: boolean;
  otpModalInitialRole: UserRole | null;
  activeOtpData: { phone: string; countryCode: string; generatedOtp: string } | null;
  otpCountdown: number;

  // Auth actions
  openOtpModal: (initialRole?: UserRole) => void;
  closeOtpModal: () => void;
  requestPhoneOtp: (phone: string, countryCode: string) => Promise<string>;
  verifyPhoneOtp: (code: string, newUserName?: string, newUserRole?: UserRole) => boolean;
  switchDemoUser: (userId: string) => void;
  logout: () => void;

  // Vendors
  vendors: Vendor[];
  currentVendor: Vendor | null; // If logged in as vendor
  updateVendorProfile: (vendorId: string, updates: Partial<Vendor>) => void;
  createVendor: (vendorData: Omit<Vendor, 'id' | 'rating' | 'reviewCount'>) => Vendor;
  setVendorStatus: (vendorId: string, status: 'active' | 'pending' | 'suspended') => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Cart
  cartItems: CartItem[];
  cartCount: number;
  groupedCart: Record<string, GroupedCartVendor>;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearVendorCart: (vendorId: string) => void;
  clearEntireCart: () => void;

  // Orders
  orders: Order[];
  createOrder: (params: {
    vendorId: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    customerNotes?: string;
    sentViaWhatsApp?: boolean;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  generateWhatsAppLink: (order: Order) => string;

  // Platform stats
  platformStats: PlatformStats;

  // Active view navigation
  activeView: 'marketplace' | 'vendor_store' | 'vendor_dashboard' | 'admin_dashboard' | 'customer_orders';
  selectedVendorId: string | null;
  navigateToMarketplace: () => void;
  navigateToVendorStore: (vendorId: string) => void;
  navigateToOrders: () => void;
  navigateToVendorDashboard: () => void;
  navigateToAdminDashboard: () => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (message: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'omnivendor_users_v1',
  VENDORS: 'omnivendor_vendors_v1',
  PRODUCTS: 'omnivendor_products_v1',
  ORDERS: 'omnivendor_orders_v1',
  CURRENT_USER_ID: 'omnivendor_curr_user_id_v1',
  CART: 'omnivendor_cart_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or initial values
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VENDORS);
      return saved ? JSON.parse(saved) : INITIAL_VENDORS;
    } catch {
      return INITIAL_VENDORS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      // Default to customer Elena Vance for immediate rich browsing experience
      return saved || 'user-customer-1';
    } catch {
      return 'user-customer-1';
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation
  const [activeView, setActiveView] = useState<'marketplace' | 'vendor_store' | 'vendor_dashboard' | 'admin_dashboard' | 'customer_orders'>('marketplace');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  // OTP flow state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpModalInitialRole, setOtpModalInitialRole] = useState<UserRole | null>(null);
  const [activeOtpData, setActiveOtpData] = useState<{
    phone: string;
    countryCode: string;
    generatedOtp: string;
  } | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
      if (currentUserId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [users, vendors, products, orders, cartItems, currentUserId]);

  // Countdown timer for OTP
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || null;
  }, [users, currentUserId]);

  const currentRole: UserRole = currentUser ? currentUser.role : 'customer';

  const currentVendor = useMemo(() => {
    if (!currentUser || currentUser.role !== 'vendor') return null;
    return vendors.find((v) => v.id === currentUser.vendorId || v.userId === currentUser.id) || null;
  }, [currentUser, vendors]);

  // Auth Functions
  const openOtpModal = (initialRole?: UserRole) => {
    setOtpModalInitialRole(initialRole || null);
    setIsOtpModalOpen(true);
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
    setOtpModalInitialRole(null);
    setActiveOtpData(null);
  };

  const requestPhoneOtp = async (phone: string, countryCode = '+91'): Promise<string> => {
    // Clean raw numbers
    const cleanPhone = phone.replace(/\D/g, '');
    // Standard 6-digit OTP generation (for Indian mobile numbers)
    const demoMatches = ['9825011000', '9825022001', '9825022002', '9825022003', '9825022004', '9825033001'];
    const generatedOtp = demoMatches.includes(cleanPhone)
      ? '123456'
      : Math.floor(100000 + Math.random() * 900000).toString();

    setActiveOtpData({
      phone: cleanPhone,
      countryCode,
      generatedOtp,
    });
    setOtpCountdown(45);
    return generatedOtp;
  };

  const verifyPhoneOtp = (
    code: string,
    newUserName?: string,
    newUserRole: UserRole = 'customer'
  ): boolean => {
    if (!activeOtpData) return false;
    if (code.trim() !== activeOtpData.generatedOtp && code.trim() !== '123456') {
      return false;
    }

    const cleanPhone = activeOtpData.phone;
    let existingUser = users.find((u) => u.phone === cleanPhone);

    if (!existingUser) {
      // Create new user
      const newUserId = `user-${Date.now()}`;
      let createdVendorId: string | undefined = undefined;

      if (newUserRole === 'vendor') {
        const newVendorId = `vendor-${Date.now()}`;
        createdVendorId = newVendorId;
        const newVendor: Vendor = {
          id: newVendorId,
          userId: newUserId,
          shopName: newUserName ? `${newUserName}'s Dukaan` : 'Apna Vyapar Store',
          tagline: 'Fresh authentic goods & handcrafted provisions',
          category: 'Kirana & Local Goods',
          phone: cleanPhone,
          countryCode: activeOtpData.countryCode || '+91',
          address: 'Main Market Road',
          city: 'Ahmedabad, Gujarat',
          rating: 5.0,
          reviewCount: 1,
          status: 'pending', // Starts as pending verification for admin
          openingHours: '09:00 - 21:00',
          gradient: 'from-amber-100 to-orange-50',
          iconName: 'Store',
          commissionRate: 4.5,
          minOrder: 200,
          deliveryFee: 40,
          description: 'Verified merchant providing quality products directly to neighborhood buyers.',
        };
        setVendors((prev) => [newVendor, ...prev]);
      }

      const newUser: User = {
        id: newUserId,
        phone: cleanPhone,
        countryCode: activeOtpData.countryCode || '+91',
        name: newUserName || (newUserRole === 'vendor' ? 'Vyapari / Merchant' : 'Customer'),
        role: newUserRole,
        vendorId: createdVendorId,
        createdAt: new Date().toISOString(),
      };

      setUsers((prev) => [...prev, newUser]);
      existingUser = newUser;
    }

    setCurrentUserId(existingUser.id);
    closeOtpModal();

    // Route appropriately based on role
    if (existingUser.role === 'admin') {
      setActiveView('admin_dashboard');
    } else if (existingUser.role === 'vendor') {
      setActiveView('vendor_dashboard');
    } else {
      setActiveView('marketplace');
    }

    showToast(`Logged in successfully as ${existingUser.name} (${existingUser.role.toUpperCase()})`);
    return true;
  };

  const switchDemoUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    setCurrentUserId(target.id);
    if (target.role === 'admin') {
      setActiveView('admin_dashboard');
    } else if (target.role === 'vendor') {
      setActiveView('vendor_dashboard');
    } else {
      setActiveView('marketplace');
    }
    showToast(`Switched persona to ${target.name} (${target.role.toUpperCase()})`);
  };

  const logout = () => {
    setCurrentUserId(null);
    setActiveView('marketplace');
    showToast('Logged out');
  };

  // Vendor actions
  const updateVendorProfile = (vendorId: string, updates: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, ...updates } : v))
    );
    showToast('Vendor profile updated successfully');
  };

  const createVendor = (vendorData: Omit<Vendor, 'id' | 'rating' | 'reviewCount'>): Vendor => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `vendor-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setVendors((prev) => [newVendor, ...prev]);
    showToast(`Shop "${newVendor.shopName}" registered`);
    return newVendor;
  };

  const setVendorStatus = (vendorId: string, status: 'active' | 'pending' | 'suspended') => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status } : v))
    );
    const label = status === 'active' ? 'Approved & Activated' : status === 'suspended' ? 'Suspended' : 'Marked Pending';
    showToast(`Vendor shop status updated: ${label}`);
  };

  // Product actions
  const addProduct = (prodData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added to catalog`);
    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Product removed from catalog');
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x ${product.name} to cart`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const clearVendorCart = (vendorId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.vendorId !== vendorId));
  };

  const clearEntireCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Grouped cart by vendor: key = vendorId
  const groupedCart = useMemo(() => {
    const groups: Record<string, GroupedCartVendor> = {};

    cartItems.forEach((item) => {
      const vId = item.product.vendorId;
      const vendor = vendors.find((v) => v.id === vId);
      if (!vendor) return;

      if (!groups[vId]) {
        groups[vId] = {
          vendor,
          items: [],
          subtotal: 0,
          deliveryFee: vendor.deliveryFee,
          total: 0,
        };
      }

      groups[vId].items.push(item);
      const itemSubtotal = item.product.price * item.quantity;
      groups[vId].subtotal += itemSubtotal;
    });

    Object.keys(groups).forEach((vId) => {
      groups[vId].total = groups[vId].subtotal + groups[vId].deliveryFee;
    });

    return groups;
  }, [cartItems, vendors]);

  // Order actions
  const generateWhatsAppLink = (order: Order): string => {
    const cleanVendorPhone = order.vendorPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanVendorPhone.startsWith('91')
      ? cleanVendorPhone
      : `91${cleanVendorPhone.length === 10 ? cleanVendorPhone : cleanVendorPhone.slice(-10)}`;

    const itemsSummary = order.items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.name} (${it.unit}) - ₹${it.totalPrice.toLocaleString('en-IN')}`
      )
      .join('\n');

    const messageText = `🛍️ *NEW ORDER INQUIRY - OmniVendor*
*Order ID:* #${order.id}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Delivery Address:* ${order.deliveryAddress}
${order.customerNotes ? `*Special Instructions:* ${order.customerNotes}\n` : ''}
*Ordered Items:*
${itemsSummary}

*Subtotal:* ₹${order.subtotal.toLocaleString('en-IN')}
*Delivery Fee:* ₹${order.deliveryFee.toLocaleString('en-IN')}
*Grand Total:* ₹${order.totalAmount.toLocaleString('en-IN')}

Kindly confirm order acceptance and estimated delivery time. Dhanyavaad!`;

    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(messageText)}`;
  };

  const createOrder = ({
    vendorId,
    customerName,
    customerPhone,
    deliveryAddress,
    customerNotes,
    sentViaWhatsApp = false,
  }: {
    vendorId: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    customerNotes?: string;
    sentViaWhatsApp?: boolean;
  }): Order | null => {
    const vendorGroup = groupedCart[vendorId];
    if (!vendorGroup || vendorGroup.items.length === 0) return null;

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customerId: currentUser ? currentUser.id : `guest-${Date.now()}`,
      customerName,
      customerPhone,
      deliveryAddress,
      customerNotes,
      vendorId: vendorGroup.vendor.id,
      vendorName: vendorGroup.vendor.shopName,
      vendorPhone: `${vendorGroup.vendor.countryCode} ${vendorGroup.vendor.phone}`,
      items: vendorGroup.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
        unit: item.product.unit,
      })),
      subtotal: vendorGroup.subtotal,
      deliveryFee: vendorGroup.deliveryFee,
      totalAmount: vendorGroup.total,
      status: 'pending_vendor_review',
      sentViaWhatsApp,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    // Clear this vendor's cart items
    clearVendorCart(vendorId);

    showToast(`Order #${orderId} sent to ${vendorGroup.vendor.shopName}!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status, updatedAt: new Date().toISOString() }
          : ord
      )
    );
    const friendlyStatus = status.replace(/_/g, ' ');
    showToast(`Order #${orderId} marked as ${friendlyStatus}`);
  };

  // Platform stats calculation
  const platformStats: PlatformStats = useMemo(() => {
    const totalVendors = vendors.length;
    const activeVendors = vendors.filter((v) => v.status === 'active').length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalVendors,
      activeVendors,
      totalProducts,
      totalOrders,
      totalRevenue,
      averageOrderValue,
    };
  }, [vendors, products, orders]);

  // Navigation helpers
  const navigateToMarketplace = () => {
    setActiveView('marketplace');
    setSelectedVendorId(null);
  };

  const navigateToVendorStore = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setActiveView('vendor_store');
  };

  const navigateToOrders = () => {
    setActiveView('customer_orders');
  };

  const navigateToVendorDashboard = () => {
    setActiveView('vendor_dashboard');
  };

  const navigateToAdminDashboard = () => {
    setActiveView('admin_dashboard');
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.VENDORS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);

    setUsers(INITIAL_USERS);
    setVendors(INITIAL_VENDORS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCartItems([]);
    setCurrentUserId('user-customer-1');
    setActiveView('marketplace');
    setSelectedVendorId(null);
    showToast('Platform data reset to default demo dataset');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isOtpModalOpen,
        otpModalInitialRole,
        activeOtpData,
        otpCountdown,
        openOtpModal,
        closeOtpModal,
        requestPhoneOtp,
        verifyPhoneOtp,
        switchDemoUser,
        logout,
        vendors,
        currentVendor,
        updateVendorProfile,
        createVendor,
        setVendorStatus,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cartItems,
        cartCount,
        groupedCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearVendorCart,
        clearEntireCart,
        orders,
        createOrder,
        updateOrderStatus,
        generateWhatsAppLink,
        platformStats,
        activeView,
        selectedVendorId,
        navigateToMarketplace,
        navigateToVendorStore,
        navigateToOrders,
        navigateToVendorDashboard,
        navigateToAdminDashboard,
        toastMessage,
        showToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
