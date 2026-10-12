import { getAssetUrl } from "../utils/assets";
import { safeLocalStorageSet } from '../utils/mediaStorage';
import React, { useState } from 'react';
import { PRODUCTS, Product } from '../data/products';
import { MessageCircle, Camera } from 'lucide-react';

interface MenuSectionProps {
  onSelectProduct: (product: Product) => void;
  onOpenOrder: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectProduct,
  onOpenOrder
}) => {
  const [filter, setFilter] = useState<'all' | 'cookie' | 'tin'>('all');
  
  // Products from localStorage or brand default
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('stackd_menu_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return PRODUCTS;
  });

  React.useEffect(() => {
    const handleDataUpdate = () => {
      try {
        const saved = localStorage.getItem('stackd_menu_products');
        if (saved) setProductsList(JSON.parse(saved));
        else setProductsList(PRODUCTS);
      } catch {}
    };
    window.addEventListener('stackd_data_updated', handleDataUpdate);
    return () => window.removeEventListener('stackd_data_updated', handleDataUpdate);
  }, []);

  // Custom user photo overrides saved in state
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('stackd_product_photos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handlePhotoUpload = (productId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const updated = { ...customPhotos, [productId]: dataUrl };
      setCustomPhotos(updated);
      try {
        safeLocalStorageSet('stackd_product_photos', JSON.stringify(updated));
      } catch (err) {
        console.error('Storage full', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredProducts = productsList.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <section id="menu" className="py-24 sm:py-32 bg-[#FAF7F0] text-[#6C1929] relative overflow-hidden">
      {/* Background paper grain */}
      <div className="absolute inset-0 paper-grain opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 border-b border-[#6C1929]/15 pb-8">
          
          {/* Small Heading: renamed to "Menu", removed "only" from "24hr pre-order" */}
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#6C1929]/75 font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C1929]" />
            <span>Menu</span>
            <span className="text-[#6C1929]/40">·</span>
            <span>24hr Pre-Order</span>
          </div>

          {/* Big Heading: Cormorant Garamond Medium (500) and in single line */}
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-3xl sm:text-4xl lg:text-[46px] text-[#6C1929] leading-tight tracking-[-0.4px] whitespace-nowrap overflow-hidden text-ellipsis mb-2">
            Curated Baked Offerings
          </h2>
          <p className="font-editorial italic text-base sm:text-lg text-[#6C1929]/80 mb-6">
            Every recipe developed from scratch by Bhavya in Worli. 100% Eggless.
          </p>

          {/* Centered Filter Box in Single Line Under Headings */}
          <div className="flex items-center p-1 bg-[#EAE1CF] rounded-full border border-[#6C1929]/15 shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#6C1929] text-[#F5F0E5] shadow-sm'
                  : 'text-[#6C1929]/75 hover:text-[#6C1929]'
              }`}
            >
              All Items (8)
            </button>
            <button
              onClick={() => setFilter('cookie')}
              className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all cursor-pointer ${
                filter === 'cookie'
                  ? 'bg-[#6C1929] text-[#F5F0E5] shadow-sm'
                  : 'text-[#6C1929]/75 hover:text-[#6C1929]'
              }`}
            >
              NYC Cookies
            </button>
            <button
              onClick={() => setFilter('tin')}
              className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all cursor-pointer ${
                filter === 'tin'
                  ? 'bg-[#6C1929] text-[#F5F0E5] shadow-sm'
                  : 'text-[#6C1929]/75 hover:text-[#6C1929]'
              }`}
            >
              Cookie Tins
            </button>
          </div>
        </div>

        {/* Editorial Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          {filteredProducts.map((product, idx) => {
            const displayImage = customPhotos[product.id] || product.image;

            return (
              <div
                key={product.id}
                className="group relative bg-[#F5F0E5] rounded-2xl border border-[#6C1929]/15 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top index */}
                <div className="flex items-center justify-between border-b border-[#6C1929]/10 pb-3 mb-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#6C1929]/75 font-semibold">
                    MENU 0{idx + 1}
                  </span>
                  {product.price && (
                    <span className="font-mono text-xs font-semibold text-[#6C1929]">
                      {product.price}
                    </span>
                  )}
                </div>

                {/* Large Product Imagery & Photo Replacement Slot */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#2D0B12] mb-6 shadow-md group/img">
                  <img
                    src={getAssetUrl(displayImage)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F070C]/50 via-transparent to-transparent pointer-events-none" />

                  {/* Photo Replacement Affordance */}
                  <label className="absolute bottom-3 right-3 bg-[#FAF7F0]/90 hover:bg-[#FAF7F0] text-[#6C1929] text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full shadow border border-[#6C1929]/20 flex items-center gap-1.5 cursor-pointer opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <Camera className="w-3 h-3" />
                    <span>Upload Real Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(product.id, file);
                      }}
                    />
                  </label>

                  {/* Tagline */}
                  <div className="absolute top-3 left-3 bg-[#6C1929]/85 backdrop-blur-md text-[#F5F0E5] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-[#F5F0E5]/20">
                    {product.tagline}
                  </div>
                </div>

                {/* Product Copy & Editorial Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial text-2xl sm:text-2.5xl font-semibold text-[#6C1929] tracking-tight mb-2">
                      {product.name}
                    </h3>
                    <p className="font-sans-clean text-xs sm:text-sm text-[#44101B]/90 leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {/* Founder Note if present */}
                    {product.founderNote && (
                      <div className="p-3.5 rounded-lg bg-[#EAE1CF]/70 border-l-2 border-[#6C1929] mb-4 text-xs text-[#521522] leading-relaxed">
                        <span className="font-semibold text-[#6C1929] block mb-0.5">
                          Founder's Trial Notes:
                        </span>
                        <p className="font-editorial italic text-xs sm:text-[13px]">
                          “{product.founderNote}”
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Single Centered Action Button: DM TO ORDER (as requested) */}
                  <div className="pt-4 border-t border-[#6C1929]/10 flex justify-center">
                    <button
                      onClick={() => {
                        onSelectProduct(product);
                        onOpenOrder();
                      }}
                      className="w-full max-w-sm py-3 px-8 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>DM to Order</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Notice */}
        <div className="mt-14 text-center text-xs text-[#6C1929]/70 font-sans-clean">
          ✨ All products are 100% eggless and freshly baked to order in Worli, Mumbai. Minimum 24 hours advance notice required.
        </div>

      </div>
    </section>
  );
};
