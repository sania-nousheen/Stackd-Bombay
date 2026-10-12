import { getAssetUrl } from "../utils/assets";
import React, { useState } from 'react';
import { PRODUCTS, Product } from '../data/products';
import { ShoppingBag, X } from 'lucide-react';

interface CookieCollectionProps {
  onSelectProduct: (product: Product) => void;
  onOpenOrder: () => void;
}

export const CookieCollection: React.FC<CookieCollectionProps> = ({
  onSelectProduct,
  onOpenOrder
}) => {
  const [selectedTastingProduct, setSelectedTastingProduct] = useState<Product | null>(null);

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

  // 2 sets of all products for 100% mathematically seamless infinite loop (-50% translation)
  const items = [...productsList, ...productsList];

  return (
    <section
      id="collection"
      className="py-24 sm:py-32 bg-[#0E0305] text-[#F5F0E5] relative overflow-hidden select-none"
    >
      {/* Background ambient dark wine glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#6C1929]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header: Single-line heading in Cormorant Garamond Medium (500) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-14 text-center">
        <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-3xl sm:text-4xl lg:text-[46px] text-[#F5F0E5] whitespace-nowrap overflow-hidden text-ellipsis leading-tight tracking-[-0.4px]">
          The Loaded NYC Collection
        </h2>
        <p className="font-editorial italic text-base sm:text-lg text-[#D8C7B0]/80 mt-2">
          Thick, chunky, 100% eggless New York cookies engineered with pure Belgian chocolate pools.
        </p>
      </div>

      {/* ======================================================== */}
      {/* INFINITE SEAMLESS HORIZONTAL MARQUEE TRACK (REFERENCE VIDEO 8) */}
      {/* Cookies moving endlessly horizontally in a continuous loop */}
      {/* ======================================================== */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Subtle edge fade masks */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#0E0305] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#0E0305] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-10 sm:gap-14 animate-marquee w-max items-center">
          {items.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="flex flex-col items-center text-center w-[280px] sm:w-[340px] shrink-0 group transition-transform duration-300 hover:scale-[1.03]"
            >
              {/* Large, beautiful high-fidelity cookie image (No top badges/tags as requested) */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6 flex items-center justify-center">
                {/* Deep realistic cookie shadow */}
                <div className="absolute inset-4 rounded-full bg-black/80 blur-xl transform translate-y-6 scale-90" />
                
                <img
                  src={getAssetUrl(product.image)}
                  alt={product.name}
                  className="relative w-full h-full object-cover rounded-full shadow-2xl transition-transform duration-500 group-hover:rotate-3"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallback = getAssetUrl('/images/hero_cookie_macro.jpg');
                    if (e.currentTarget.src !== fallback && e.currentTarget.src !== window.location.origin + fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
              </div>

              {/* Product Name (Bold, Clean, Editorial) */}
              <h3 className="font-editorial text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#F5F0E5] mb-1">
                {product.name}
              </h3>

              {/* Tag / Short flavor descriptor */}
              <p className="text-xs font-sans-clean uppercase tracking-[0.2em] text-[#D8C7B0]/75 mb-4">
                ({product.tagline})
              </p>

              {/* Dual Action Buttons matching Reference Video 8 */}
              <div className="flex flex-col gap-2 w-full max-w-[210px]">
                <button
                  onClick={() => setSelectedTastingProduct(product)}
                  className="w-full py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 text-[#F5F0E5] text-[11px] font-semibold tracking-wider uppercase transition-colors backdrop-blur-sm cursor-pointer"
                >
                  View Tasting Notes
                </button>
                <button
                  onClick={() => {
                    onSelectProduct(product);
                    onOpenOrder();
                  }}
                  className="w-full py-2 px-4 rounded-full bg-[#6C1929] hover:bg-[#852234] text-[#F5F0E5] text-[11px] font-bold tracking-wider uppercase transition-colors shadow cursor-pointer"
                >
                  Meet The Collection
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Tasting Notes Drawer Modal */}
      {selectedTastingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#1A060A] text-[#F5F0E5] max-w-md w-full rounded-2xl border border-[#F5F0E5]/20 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedTastingProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F5F0E5] transition-colors cursor-pointer"
              aria-label="Close notes"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden shadow-xl border border-white/15">
              <img
                src={getAssetUrl(selectedTastingProduct.image)}
                alt={selectedTastingProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center mb-4">
              <h3 className="font-editorial text-2xl font-bold uppercase text-[#F5F0E5]">
                {selectedTastingProduct.name}
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#D8C7B0]/75 mt-0.5">
                {selectedTastingProduct.tagline}
              </p>
            </div>

            <p className="font-sans-clean text-xs sm:text-sm text-[#F5F0E5]/85 leading-relaxed text-center mb-4">
              {selectedTastingProduct.description}
            </p>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-center mb-6">
              <span className="font-semibold text-[#D8C7B0] block mb-1">Texture Profile:</span>
              <span>{selectedTastingProduct.texture}</span>
            </div>

            <button
              onClick={() => {
                const prod = selectedTastingProduct;
                setSelectedTastingProduct(null);
                onSelectProduct(prod);
                onOpenOrder();
              }}
              className="w-full py-3 bg-[#6C1929] hover:bg-[#852234] text-[#F5F0E5] text-xs font-bold tracking-wider uppercase rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pre-Order This Bake</span>
            </button>
          </div>
        </div>
      )}

      {/* Marquee Keyframes CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
};
