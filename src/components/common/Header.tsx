import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ChevronDown, LogOut, Check, Store } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const {
    currentUser,
    currentRole,
    openOtpModal,
    logout,
    activeView,
    cartCount,
    navigateToMarketplace,
    navigateToOrders,
    navigateToVendorDashboard,
    navigateToAdminDashboard,
    switchDemoUser,
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line wordmark */}
        <button
          onClick={navigateToMarketplace}
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-stone-900 hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>OmniVendor</span>
        </button>

        {/* Zone 2: 4–5 nav links, 1–2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-600">
          <button
            onClick={navigateToMarketplace}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'marketplace' || activeView === 'vendor_store'
                ? 'text-stone-900 border-b-2 border-amber-500'
                : 'hover:text-stone-900'
            }`}
          >
            Marketplace
          </button>

          <button
            onClick={navigateToOrders}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'customer_orders'
                ? 'text-stone-900 border-b-2 border-amber-500'
                : 'hover:text-stone-900'
            }`}
          >
            My Orders
          </button>

          <button
            onClick={navigateToVendorDashboard}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'vendor_dashboard'
                ? 'text-stone-900 border-b-2 border-amber-500'
                : 'hover:text-stone-900'
            }`}
          >
            Vendor Portal
          </button>

          <button
            onClick={navigateToAdminDashboard}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'admin_dashboard'
                ? 'text-stone-900 border-b-2 border-amber-500'
                : 'hover:text-stone-900'
            }`}
          >
            Admin Console
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-stone-950 bg-amber-400 rounded-full font-mono tabular-nums shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-150 border border-stone-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentRole === 'vendor' ? 'bg-amber-500' : currentRole === 'admin' ? 'bg-indigo-500' : 'bg-emerald-500'
                  }`}
                />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
                <span className="text-stone-500 capitalize text-[11px]">({currentRole})</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl p-2 text-xs z-50">
                  <div className="px-3 py-2 border-b border-stone-100 mb-1">
                    <div className="font-bold text-stone-900">{currentUser.name}</div>
                    <div className="text-[11px] text-stone-500">
                      {currentUser.countryCode} {currentUser.phone} · Role: {currentUser.role}
                    </div>
                  </div>

                  <div className="py-1 text-[10px] font-bold text-stone-400 px-3 uppercase tracking-wider">
                    Quick-Switch Persona
                  </div>

                  <button
                    onClick={() => {
                      switchDemoUser('user-customer-1');
                      setIsPersonaMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-left rounded-lg hover:bg-stone-50 text-stone-700 font-medium"
                  >
                    <span>Priya Desai (Customer)</span>
                    {currentUser.id === 'user-customer-1' && (
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('user-vendor-1');
                      setIsPersonaMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-left rounded-lg hover:bg-stone-50 text-stone-700 font-medium"
                  >
                    <span>Ramesh Patel (Anand Sweets)</span>
                    {currentUser.id === 'user-vendor-1' && (
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('user-vendor-2');
                      setIsPersonaMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-left rounded-lg hover:bg-stone-50 text-stone-700 font-medium"
                  >
                    <span>Vinay Sundaram (Malabar Coffee)</span>
                    {currentUser.id === 'user-vendor-2' && (
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('user-admin-1');
                      setIsPersonaMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-left rounded-lg hover:bg-stone-50 text-stone-700 font-medium"
                  >
                    <span>Rajesh Sharma (Admin)</span>
                    {currentUser.id === 'user-admin-1' && (
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </button>

                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsPersonaMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-1.5 px-3 py-1.5 text-left rounded-lg hover:bg-red-50 text-stone-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openOtpModal('vendor')}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Vendor Login</span>
              </button>

              <button
                onClick={() => openOtpModal('customer')}
                className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-xs"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
