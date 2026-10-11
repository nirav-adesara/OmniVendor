import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  ArrowLeft,
  Store,
  MapPin,
  Clock,
  Star,
  Plus,
  MessageCircle,
  Truck,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface VendorStoreViewProps {
  vendorId: string;
  onSelectProduct: (product: Product) => void;
  onOpenCart: () => void;
}

export const VendorStoreView: React.FC<VendorStoreViewProps> = ({
  vendorId,
  onSelectProduct,
  onOpenCart,
}) => {
  const {
    vendors,
    products,
    addToCart,
    groupedCart,
    navigateToMarketplace,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const vendor = useMemo(() => {
    return vendors.find((v) => v.id === vendorId);
  }, [vendors, vendorId]);

  const vendorProducts = useMemo(() => {
    return products.filter((p) => p.vendorId === vendorId);
  }, [products, vendorId]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    vendorProducts.forEach((p) => cats.add(p.category));
    return ['all', ...Array.from(cats)];
  }, [vendorProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return vendorProducts;
    return vendorProducts.filter((p) => p.category === selectedCategory);
  }, [vendorProducts, selectedCategory]);

  const cartGroup = groupedCart[vendorId];
  const itemsInStoreCart = cartGroup?.items.reduce((s, i) => s + i.quantity, 0) || 0;

  if (!vendor) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col items-center justify-center p-6 text-center">
        <Store className="w-12 h-12 text-stone-400 mb-4" />
        <h2 className="text-xl font-bold text-stone-900 mb-2">Merchant Storefront Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">The requested vendor mini-store does not exist.</p>
        <button
          onClick={navigateToMarketplace}
          className="px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const cleanPhone = vendor.phone.replace(/\D/g, '');
  const whatsAppUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
    `Namaste ${vendor.shopName}, I am browsing your mini-store on OmniVendor and would like to ask about item availability.`
  )}`;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-24">
      {/* Back Bar */}
      <div className="border-b border-stone-200 bg-white/80 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <button
            onClick={navigateToMarketplace}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Stores</span>
          </button>

          {itemsInStoreCart > 0 && (
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-2xs"
            >
              <span>{itemsInStoreCart} items in cart (₹{cartGroup.subtotal.toLocaleString('en-IN')})</span>
            </button>
          )}
        </div>
      </div>

      {/* Vendor Mini-Store Header in Light Theme */}
      <section className={`border-b border-stone-200 bg-gradient-to-br ${vendor.gradient} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-md shrink-0">
                <Store className="w-8 h-8" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-800 tracking-wider uppercase">
                    {vendor.category}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Dukaan</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
                  {vendor.shopName}
                </h1>

                <p className="text-sm text-stone-700 mt-1 max-w-2xl leading-relaxed">
                  {vendor.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span className="font-medium text-stone-800">{vendor.address}, {vendor.city}</span>
                  </div>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>{vendor.openingHours}</span>
                  </div>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-stone-900 font-mono tabular-nums">{vendor.rating}</span>
                    <span className="text-stone-500">({vendor.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Merchant Quick Actions & Terms */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 min-w-[260px] space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                <span className="text-stone-500">Min Order</span>
                <span className="font-bold text-stone-900 font-mono tabular-nums">₹{vendor.minOrder}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                <span className="text-stone-500 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  <span>Delivery Fee</span>
                </span>
                <span className="font-bold text-stone-900 font-mono tabular-nums">₹{vendor.deliveryFee}</span>
              </div>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-stone-200 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const inCartCount =
              cartGroup?.items.find((i) => i.product.id === product.id)?.quantity || 0;

            return (
              <div
                key={product.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-300 hover:shadow-xs transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="text-amber-800 font-bold">{product.category}</span>
                    <span className="font-mono text-stone-500">{product.unit}</span>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-base text-stone-900 hover:text-amber-700 cursor-pointer transition-colors"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {product.stockStatus === 'low_stock' && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                        Only {product.inventoryCount} left
                      </span>
                    )}
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
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors shadow-2xs bg-amber-400 hover:bg-amber-300 text-stone-950"
                    >
                      {inCartCount > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{inCartCount} in Cart</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
