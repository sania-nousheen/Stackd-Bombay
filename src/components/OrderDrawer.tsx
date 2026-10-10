import React, { useState } from 'react';
import { PRODUCTS, Product } from '../data/products';
import { X, Plus, Minus, Send, MessageCircle, MapPin, Clock, Check } from 'lucide-react';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: Product | null;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  selectedProduct
}) => {
  // Cart items tracking quantity per product ID
  const [cart, setCart] = useState<Record<string, number>>(() => {
    if (selectedProduct) {
      return { [selectedProduct.id]: 1 };
    }
    return { 'holy-trinity': 1 };
  });

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('Worli');
  const [customAddress, setCustomAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    // Default to tomorrow for 24hr preorder
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Mumbai specific delivery neighborhoods
  const mumbaiAreas = [
    'Worli (South Mumbai)',
    'Lower Parel',
    'Bandra West',
    'Bandra East',
    'Juhu',
    'Colaba / Fort',
    'Marine Lines / Nariman Point',
    'Dadar / Prabhadevi',
    'Khar / Santacruz',
    'Andheri West',
    'Powai',
    'Other Mumbai Location'
  ];

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[productId];
      } else {
        updated[productId] = next;
      }
      return updated;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  // Generate WhatsApp formatted message
  const handleWhatsAppOrder = () => {
    const selectedItemsText = Object.entries(cart)
      .map(([id, qty]) => {
        const prod = PRODUCTS.find((p) => p.id === id);
        return `• ${qty}x ${prod?.name || id} (${prod?.category === 'tin' ? 'Cookie Tin' : 'NYC Cookie'})`;
      })
      .join('\n');

    const message = `*STACKD BOMBAY — 24HR PRE-ORDER INQUIRY* 🍪✨\n\n` +
      `*Name:* ${customerName || 'Mumbai Customer'}\n` +
      `*Phone:* ${customerPhone || 'Not specified'}\n` +
      `*Delivery Area:* ${deliveryArea}\n` +
      `*Address:* ${customAddress || 'Provided on confirmation'}\n` +
      `*Requested Date:* ${deliveryDate} (24hr notice)\n\n` +
      `*Items Requested:*\n${selectedItemsText}\n\n` +
      (specialInstructions ? `*Notes/Occasion:* ${specialInstructions}\n\n` : '') +
      `_Hi Bhavya, please confirm availability and batch details for this fresh bake!_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919820000000?text=${encoded}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-[#FAF7F0] text-[#6C1929] h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#6C1929]/15 flex items-center justify-between bg-[#F5F0E5]">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-bold text-[#6C1929]/75 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#6C1929]" />
              <span>24hr Pre-Order Dispatch</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#6C1929]">
              Bake Your Box
            </h2>
            <p className="text-xs text-[#6C1929]/70">
              Freshly baked in Worli · Exclusive to Mumbai
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#6C1929]/10 text-[#6C1929] transition-colors cursor-pointer"
            aria-label="Close pre-order drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Mumbai Notice Banner */}
          <div className="p-3.5 rounded-xl bg-[#6C1929]/10 border border-[#6C1929]/20 text-xs text-[#54121F] flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#6C1929] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Strict 24-Hour Advance Notice:</strong> Bhavya prepares fresh dough batches with French butter and Belgian couverture daily. No old batches, no freezer stock.
            </p>
          </div>

          {/* Item Selector List */}
          <div>
            <h3 className="font-editorial text-lg font-semibold text-[#6C1929] mb-3">
              Select Cookies & Loaded Tins
            </h3>
            <div className="space-y-3">
              {PRODUCTS.map((prod) => {
                const qty = cart[prod.id] || 0;
                return (
                  <div
                    key={prod.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      qty > 0
                        ? 'bg-[#F5F0E5] border-[#6C1929]/40 shadow-sm'
                        : 'bg-white/50 border-[#6C1929]/10 hover:border-[#6C1929]/25'
                    }`}
                  >
                    <div className="pr-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-editorial text-base font-semibold text-[#6C1929]">
                          {prod.name}
                        </span>
                        {prod.category === 'tin' && (
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-[#6C1929] text-[#F5F0E5] px-1.5 py-0.5 rounded">
                            Tin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6C1929]/75 line-clamp-1 mt-0.5">
                        {prod.texture}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(prod.id, -1)}
                        disabled={qty === 0}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
                          qty > 0
                            ? 'border-[#6C1929]/30 text-[#6C1929] hover:bg-[#6C1929] hover:text-[#F5F0E5]'
                            : 'border-gray-200 text-gray-300 cursor-not-allowed'
                        }`}
                        aria-label={`Decrease quantity of ${prod.name}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-sm text-[#6C1929]">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(prod.id, 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-[#6C1929] text-[#F5F0E5] hover:bg-[#52111E] transition-colors shadow-sm"
                        aria-label={`Increase quantity of ${prod.name}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mumbai Delivery Details Form */}
          <div className="space-y-4 pt-4 border-t border-[#6C1929]/15">
            <h3 className="font-editorial text-lg font-semibold text-[#6C1929]">
              Mumbai Delivery Information
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6C1929]/80 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Rhea Mehta"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#6C1929]/20 text-xs focus:outline-none focus:border-[#6C1929]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6C1929]/80 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +91 98200 XXXXX"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#6C1929]/20 text-xs focus:outline-none focus:border-[#6C1929]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6C1929]/80 mb-1">
                Mumbai Neighborhood (Strictly Mumbai)
              </label>
              <select
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#6C1929]/20 text-xs focus:outline-none focus:border-[#6C1929] cursor-pointer"
              >
                {mumbaiAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6C1929]/80 mb-1">
                Desired Bake & Delivery Date (24hr Pre-order)
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#6C1929]/20 text-xs focus:outline-none focus:border-[#6C1929]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6C1929]/80 mb-1">
                Special Notes / Gift Tag Message
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Birthday surprise note for my friend, extra warm instructions..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#6C1929]/20 text-xs focus:outline-none focus:border-[#6C1929] resize-none"
              />
            </div>
          </div>

        </div>

        {/* Drawer Bottom Action */}
        <div className="p-6 border-t border-[#6C1929]/15 bg-[#F5F0E5] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6C1929] font-medium">
            <span>Selected Items:</span>
            <span className="font-bold font-mono">{totalItems} loaded items</span>
          </div>

          <button
            onClick={handleWhatsAppOrder}
            disabled={totalItems === 0}
            className={`w-full py-3.5 px-6 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              totalItems > 0
                ? 'bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] active:scale-[0.99]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Send Pre-Order on WhatsApp</span>
          </button>

          <p className="text-[11px] text-center text-[#6C1929]/65">
            Connects directly with Bhavya's kitchen on WhatsApp for instant confirmation.
          </p>
        </div>

      </div>
    </div>
  );
};
