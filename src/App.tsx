/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { OtpModal } from './components/common/OtpModal';
import { MarketplaceView } from './components/customer/MarketplaceView';
import { VendorStoreView } from './components/customer/VendorStoreView';
import { CustomerOrdersView } from './components/customer/CustomerOrdersView';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationToast } from './components/common/NotificationToast';
import { Product } from './types';

const MainLayout: React.FC = () => {
  const {
    activeView,
    selectedVendorId,
    navigateToMarketplace,
  } = useApp();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Light Top Bar Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'marketplace' && (
          <MarketplaceView onSelectProduct={(prod) => setSelectedProduct(prod)} />
        )}

        {activeView === 'vendor_store' && selectedVendorId && (
          <VendorStoreView
            vendorId={selectedVendorId}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {activeView === 'vendor_store' && !selectedVendorId && (
          <MarketplaceView onSelectProduct={(prod) => setSelectedProduct(prod)} />
        )}

        {activeView === 'customer_orders' && <CustomerOrdersView />}

        {activeView === 'vendor_dashboard' && <VendorDashboard />}

        {activeView === 'admin_dashboard' && <AdminDashboard />}
      </main>

      {/* Product Inspection Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Grouped Multi-Vendor Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Simple Indian Phone OTP Verification Modal */}
      <OtpModal />

      {/* Floating System Notification Toast */}
      <NotificationToast />

      {/* Clean Light-Themed Footer */}
      <footer className="border-t border-stone-200 bg-white py-10 px-4 sm:px-6 lg:px-8 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">OmniVendor Bharat</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Hyperlocal Multi-Vendor Platform & WhatsApp Dukaan Orders</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600 font-medium">
            <button
              onClick={navigateToMarketplace}
              className="hover:text-stone-900 transition-colors"
            >
              Marketplace
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>WhatsApp Ordering (wa.me)</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>+91 Mobile OTP Auth</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
