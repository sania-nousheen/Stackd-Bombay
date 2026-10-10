import React from 'react';
import { MessageCircle, Instagram, MapPin, Clock } from 'lucide-react';

interface ContactSectionProps {
  onOpenOrder: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenOrder }) => {
  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      "Hi Bhavya! I'd like to place a 24-hr pre-order for Stackd Bombay cookies/tins in Mumbai. Please share your current batch availability!"
    );
    window.open(`https://wa.me/919820000000?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-28 sm:py-36 bg-[#5A1322] text-[#F5F0E5] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6C1929] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute inset-0 paper-grain opacity-25 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative z-10">
        
        {/* Brand Kicker with NO AI icon as requested */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#F5F0E5]/10 border border-[#F5F0E5]/20 text-xs uppercase tracking-[0.25em] font-semibold text-[#F5F0E5] mb-5">
          Worli Kitchen Dispatch
        </div>

        {/* Big Editorial Heading in Cormorant Garamond Medium (500) */}
        <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-4xl sm:text-5xl lg:text-[54px] tracking-[-0.4px] text-[#F5F0E5] leading-tight mb-4 text-balance">
          Ready To Eat Stackd?
        </h2>

        {/* Supporting Copy */}
        <p className="font-editorial italic text-xl sm:text-2xl text-[#E8DAC5] mb-8 text-balance">
          “Freshly baked. 100% eggless. Made in Mumbai.”
        </p>

        {/* Location & Notice Badge */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#F5F0E5]/85 font-sans-clean mb-12">
          <div className="flex items-center gap-2 bg-[#420E18]/60 px-4 py-2 rounded-full border border-[#F5F0E5]/15">
            <MapPin className="w-4 h-4 text-[#F5F0E5]" />
            <span>Worli, Mumbai</span>
          </div>
          <div className="flex items-center gap-2 bg-[#420E18]/60 px-4 py-2 rounded-full border border-[#F5F0E5]/15">
            <Clock className="w-4 h-4 text-[#F5F0E5]" />
            <span>24-Hour Pre-Order Notice Required</span>
          </div>
        </div>

        {/* Primary CTA: ORDER ON WHATSAPP + Secondary Drawer Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
          <button
            onClick={handleWhatsAppDirect}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#F5F0E5] hover:bg-[#FFFFFF] text-[#6C1929] text-xs font-bold tracking-[0.18em] uppercase rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Order On WhatsApp</span>
          </button>
          
          <button
            onClick={onOpenOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-transparent hover:bg-[#F5F0E5]/10 text-[#F5F0E5] border border-[#F5F0E5]/30 text-xs font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>Customize Box</span>
          </button>
        </div>

        {/* Instagram Link */}
        <div className="pt-6 border-t border-[#F5F0E5]/15">
          <a
            href="https://instagram.com/stackd.bombay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E8DAC5] hover:text-[#FFFFFF] transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram: @stackd.bombay</span>
          </a>
        </div>

      </div>
    </section>
  );
};
