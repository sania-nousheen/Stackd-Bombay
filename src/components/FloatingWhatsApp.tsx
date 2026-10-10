import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  onOpenOrder: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onOpenOrder }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi Bhavya! I'd like to place a 24-hr pre-order for Stackd Bombay cookies/tins in Mumbai."
    );
    window.open(`https://wa.me/919820000000?text=${message}`, '_blank');
  };

  return (
    <aside
      aria-label="WhatsApp direct ordering"
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] border border-[#F5F0E5]/30 rounded-full shadow-xl transition-all duration-300 p-2 sm:p-2.5 active:scale-95 cursor-pointer"
        aria-label="Order on WhatsApp with Bhavya"
      >
        {/* Tasteful small circular icon in brand ivory/burgundy treatment */}
        <div className="w-9 h-9 rounded-full bg-[#F5F0E5] text-[#6C1929] flex items-center justify-center shadow-sm shrink-0">
          <MessageCircle className="w-5 h-5 fill-current" />
        </div>

        {/* Expands on hover or visible label on desktop */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out flex items-center ${
            isHovered ? 'max-w-44 px-3 opacity-100' : 'max-w-0 px-0 opacity-0'
          } hidden sm:flex`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-[#F5F0E5]">
            Order on WhatsApp
          </span>
        </div>
      </button>
    </aside>
  );
};
