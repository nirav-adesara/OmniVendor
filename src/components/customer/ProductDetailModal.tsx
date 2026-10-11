import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, Store, Package } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { vendors, addToCart, navigateToVendorStore } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const vendor = vendors.find((v) => v.id === product.vendorId);

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl p-6 text-stone-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-500 font-mono">{product.unit}</span>
          </div>

          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            {product.name}
          </h2>

          {vendor && (
            <button
              onClick={() => {
                navigateToVendorStore(vendor.id);
                onClose();
              }}
              className="mt-1 flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-700 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Dukaan: <strong className="text-stone-900">{vendor.shopName}</strong></span>
            </button>
          )}
        </div>

        {/* Description & Specifications */}
        <div className="py-4 border-y border-stone-150 space-y-4">
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-stone-700 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 block">Stock Availability</span>
              <span className="font-bold text-stone-800 capitalize">
                {product.stockStatus.replace('_', ' ')} ({product.inventoryCount} units)
              </span>
            </div>
            <div>
              <span className="text-stone-500 block">Packaging Unit</span>
              <span className="font-bold text-stone-800 font-mono">
                {product.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-stone-500 font-medium">Total Amount</div>
            <div className="text-2xl font-black font-mono tabular-nums text-stone-900">
              ₹{(product.price * quantity).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-mono font-bold text-xs text-stone-900 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-2xs"
            >
              <Package className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
