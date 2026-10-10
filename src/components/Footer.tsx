import React from 'react';
import { Instagram, MessageCircle, MapPin, ArrowUp, Lock } from 'lucide-react';
import { StackdLogo } from './StackdLogo';

interface FooterProps {
  onOpenOrder: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOrder,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      "Hi Bhavya! I'd like to place an order for Stackd Bombay cookies/tins."
    );
    window.open(`https://wa.me/919820000000?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-[#6C1929] text-[#F5F0E5] pt-20 pb-12 border-t border-[#F5F0E5]/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[#F5F0E5]/15">
          
          {/* Brand Column with Authentic StackdLogo */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-start">
              <StackdLogo color="#F5F0E5" size="md" />
            </div>

            <p className="font-editorial italic text-lg text-[#F5F0E5]/90 pt-1">
              “Chunky. Eggless. New York-style cookies.”
            </p>

            <div className="flex items-center gap-2 text-xs text-[#F5F0E5]/80 font-sans-clean pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#F5F0E5]" />
              <span>Worli, Mumbai</span>
            </div>

            <div className="pt-2">
              <a
                href="https://instagram.com/stackd.bombay"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#F5F0E5]/90 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram: @stackd.bombay</span>
              </a>
            </div>
          </div>

          {/* Section 35 exact navigation links */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-[#F5F0E5] mb-4">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs uppercase tracking-wider text-[#F5F0E5]/85 font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-white transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  Cookies
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#journal" className="hover:text-white transition-colors">
                  Journal
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Primary Action Button & Admin Link */}
          <div className="md:col-span-3 space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-[#F5F0E5] mb-2">
                Order
              </h4>
              <p className="text-xs text-[#F5F0E5]/80 leading-relaxed font-light">
                Freshly baked to order in Mumbai with French butter and Belgian couverture.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#F5F0E5] hover:bg-[#FFFFFF] text-[#6C1929] rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp</span>
              </button>

              {/* Admin Portal Launcher Button */}
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-black/25 hover:bg-black/40 text-[#F5F0E5] rounded-xl text-[11px] font-sans-clean font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-[#F5F0E5]/15 shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Portal (Menu, Reels, Journal)</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Small Copyright Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5F0E5]/60 font-sans-clean">
          <div>
            <span>© {new Date().getFullYear()} STACKD BOMBAY. Mumbai.</span>
          </div>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-[#F5F0E5]/10 hover:bg-[#F5F0E5]/20 text-[#F5F0E5] transition-colors cursor-pointer"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
