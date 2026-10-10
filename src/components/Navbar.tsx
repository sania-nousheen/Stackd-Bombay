import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { StackdLogo } from './StackdLogo';

interface NavbarProps {
  onOpenOrder: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrder, cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#' },
    { label: 'OUR STORY', href: '#story' },
    { label: 'MENU', href: '#menu' },
    { label: 'REVIEWS', href: '#reviews' },
    { label: 'JOURNAL', href: '#journal' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F5F0E5]/95 backdrop-blur-md border-b border-[#6C1929]/15 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: STACKD BOMBAY brand logo */}
        <a
          href="#"
          className="group flex flex-col items-center transition-all duration-300 hover:opacity-95"
          aria-label="STACKD BOMBAY Homepage"
        >
          <StackdLogo
            color={isScrolled ? '#6C1929' : '#F5F0E5'}
            size="sm"
            className={isScrolled ? '' : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]'}
          />
        </a>

        {/* Center: Navigation Links in white text when not scrolled */}
        <nav
          className={`hidden lg:flex items-center gap-7 text-[12px] font-semibold tracking-wider uppercase transition-colors duration-300 ${
            isScrolled ? 'text-[#6C1929]/85' : 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`transition-colors relative py-1 ${
                isScrolled
                  ? 'hover:text-[#6C1929] after:bg-[#6C1929]'
                  : 'hover:text-white/80 after:bg-white'
              } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:scale-x-0 hover:after:scale-x-100 after:transition-transform`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side: ORDER NOW */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenOrder}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] text-xs font-bold tracking-[0.16em] uppercase rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] whitespace-nowrap cursor-pointer border border-[#F5F0E5]/20"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Now</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#F5F0E5] text-[#6C1929] text-[10px] font-bold flex items-center justify-center ml-0.5">
                {cartCount}
              </span>
            )}
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${
              isScrolled
                ? 'text-[#6C1929] hover:bg-[#6C1929]/10'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F0] border-b border-[#6C1929]/15 px-6 py-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3 text-xs font-bold tracking-wider uppercase text-[#6C1929]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 border-b border-[#6C1929]/10 flex justify-between items-center hover:text-[#4A0E1B]"
              >
                <span>{link.label}</span>
                <span className="text-[10px] text-[#6C1929]/40">→</span>
              </a>
            ))}
            <div className="pt-2 text-[11px] text-[#6C1929]/70 tracking-normal normal-case">
              📍 Freshly baked in Worli, Mumbai · 24hr pre-orders
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
