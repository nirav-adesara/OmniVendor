import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Search,
  Store,
  MapPin,
  Star,
  Plus,
  ArrowRight,
  MessageCircle,
  Clock,
} from 'lucide-react';

interface MarketplaceViewProps {
  onSelectProduct: (product: Product) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onSelectProduct }) => {
  const {
    vendors,
    products,
    addToCart,
    navigateToVendorStore,
    openOtpModal,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    vendors.forEach((v) => cats.add(v.category));
    return ['all', ...Array.from(cats)];
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (v.status !== 'active') return false;
      const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
      const matchesSearch =
        v.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [vendors, selectedCategory, searchQuery]);

  const featuredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const vendor = vendors.find((v) => v.id === p.vendorId);
        return vendor && vendor.status === 'active';
      })
      .slice(0, 6);
  }, [products, vendors]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      {/* Light Theme Search & Actions Bar */}
      <section className="relative border-b border-stone-200 bg-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search sweets, filter coffee, handloom, spices, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-amber-500 shadow-xs"
              />
            </div>
            {!currentUser && (
              <div className="flex gap-2">
                <button
                  onClick={() => openOtpModal('customer')}
                  className="px-5 py-3 text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openOtpModal('vendor')}
                  className="px-4 py-3 text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  Vyapar Login
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Segmented Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Merchants & Dukaans' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Vendor Mini-Stores Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-stone-900">
              Verified Merchant Mini-Stores
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Each storefront operates independently with direct customer WhatsApp inquiry and delivery
            </p>
          </div>
          <span className="text-xs text-stone-500 font-mono tabular-nums font-semibold">
            {filteredVendors.length} Dukaans Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => {
            const vendorProds = products.filter((p) => p.vendorId === vendor.id);

            return (
              <div
                key={vendor.id}
                className="group flex flex-col justify-between bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* Store Header Banner */}
                <div className={`p-6 bg-gradient-to-br ${vendor.gradient} border-b border-stone-200 relative`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-xs">
                      <Store className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-stone-200 text-xs font-mono text-stone-800 shadow-2xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold">{vendor.rating}</span>
                      <span className="text-stone-500">({vendor.reviewCount})</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                      {vendor.category}
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                      {vendor.shopName}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {vendor.tagline}
                    </p>
                  </div>
                </div>

                {/* Store Metadata */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mb-4 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-medium text-stone-700">{vendor.city}</span>
                      </div>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{vendor.openingHours}</span>
                      </div>
                    </div>

                    {/* Product Preview Chips */}
                    <div className="mb-4">
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                        Popular Offerings ({vendorProds.length})
                      </div>
                      <div className="space-y-1.5">
                        {vendorProds.slice(0, 3).map((prod) => (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-stone-50 hover:bg-amber-50/60 transition-colors border border-stone-100"
                          >
                            <span className="text-stone-700 font-medium truncate max-w-[180px]">
                              {prod.name}
                            </span>
                            <span className="text-stone-900 font-mono tabular-nums font-bold">
                              ₹{prod.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Store Actions */}
                  <div className="pt-4 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => navigateToVendorStore(vendor.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                    >
                      <span>Visit Mini-Store</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`https://wa.me/91${vendor.phone}?text=${encodeURIComponent(
                        `Namaste ${vendor.shopName}, I found your store on OmniVendor and would like to inquire about your products.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Direct WhatsApp Inquiry"
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-stone-900">
              Regional Specialties
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Add directly to your vendor-grouped shopping cart or send inquiry
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => {
            const vendor = vendors.find((v) => v.id === product.vendorId);

            return (
              <div
                key={product.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between hover:border-stone-300 hover:shadow-xs transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <button
                      onClick={() => vendor && navigateToVendorStore(vendor.id)}
                      className="text-amber-700 hover:underline font-bold truncate max-w-[180px]"
                    >
                      {vendor?.shopName || 'Vendor'}
                    </button>
                    <span className="font-mono text-stone-500 font-medium">{product.unit}</span>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-base text-stone-900 hover:text-amber-700 cursor-pointer transition-colors"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-stone-400 font-medium">Price</div>
                    <div className="text-lg font-bold font-mono tabular-nums text-stone-900">
                      ₹{product.price}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
