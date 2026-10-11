export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  phone: string;
  countryCode: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  vendorId?: string; // If role === 'vendor'
  createdAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  shopName: string;
  tagline: string;
  category: string;
  phone: string; // Used for WhatsApp deep links
  countryCode: string;
  address: string;
  city: string;
  rating: number;
  reviewCount: number;
  status: 'active' | 'pending' | 'suspended';
  openingHours: string;
  gradient: string;
  iconName: string;
  commissionRate: number; // e.g. 5%
  minOrder: number;
  deliveryFee: number;
  description: string;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  inventoryCount: number;
  unit: string; // e.g. "loaf", "250g bag", "potted plant"
  tags: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending_vendor_review'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup_or_delivery'
  | 'completed'
  | 'declined';

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  unit: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  customerNotes?: string;
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  sentViaWhatsApp: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformStats {
  totalVendors: number;
  activeVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
