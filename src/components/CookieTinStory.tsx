import { getAssetUrl } from "../utils/assets";
import React, { useState, useEffect } from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { subscribeSiteMedia } from '../services/firebase';
import { safeLocalStorageSet } from '../utils/mediaStorage';
import nutellaTinImage from '../assets/images/cookie_nutella_tin_1791484044384.jpg';

interface CookieTinStoryProps {
  onOpenOrder: () => void;
}

export const CookieTinStory: React.FC<CookieTinStoryProps> = ({ onOpenOrder }) => {
  const [tinPhoto, setTinPhoto] = useState<string>(() => {
    try {
      return localStorage.getItem('stackd_tin_photo') || nutellaTinImage;
    } catch {
      return nutellaTinImage;
    }
  });

  useEffect(() => {
    // 1. Real-time subscription to shared Firestore site_media
    const unsubscribe = subscribeSiteMedia((mediaMap) => {
      if (mediaMap.tin) {
        setTinPhoto(mediaMap.tin);
        safeLocalStorageSet('stackd_tin_photo', mediaMap.tin);
      }
    });

    // 2. Tab update listener
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('stackd_tin_photo');
        if (saved) setTinPhoto(saved);
      } catch {}
    };
    window.addEventListener('stackd_data_updated', handleUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('stackd_data_updated', handleUpdate);
    };
  }, []);

  return (
    <section className="py-24 sm:py-32 bg-[#44101B] text-[#F5F0E5] relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6C1929]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#22070D]/70 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Cookie Tin Visual Presentation */}
          <div className="lg:col-span-6 relative group">
            <div className="relative aspect-[4/3] w-full shrink-0 rounded-2xl overflow-hidden border border-[#F5F0E5]/20 shadow-2xl bg-[#1C0509]">
              <img
                src={getAssetUrl(tinPhoto)}
                alt="Stacked loaded cookies inside keepsake deep burgundy Stackd tin with melted Nutella"
                className="w-full h-full object-cover object-center block"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C0509]/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Tin Badge */}
              <div className="absolute top-4 left-4 bg-[#F5F0E5]/90 backdrop-blur-md text-[#6C1929] px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase shadow">
                Signature Loaded Tin
              </div>
            </div>

            {/* Scrapbook Note Overlay */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-[#FAF7F0] text-[#6C1929] p-4 rounded-xl shadow-xl border border-[#6C1929]/15 max-w-[240px] rotate-[2deg]">
              <span className="font-sugar-cookie text-xl text-[#6C1929] leading-none block mb-1">
                The Keepsake Tin
              </span>
              <p className="font-sans-clean text-xs text-[#6C1929]/80 leading-tight">
                Designed to be kept on your kitchen counter long after the last crumb is gone.
              </p>
            </div>
          </div>

          {/* RIGHT: The Tin Evolution Story */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F0E5]/10 border border-[#F5F0E5]/20 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#EADECB] mb-4">
              <Package className="w-3 h-3 text-[#F5F0E5]" />
              <span>Packaging Journey</span>
            </div>

            {/* Heading */}
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-3xl sm:text-4xl lg:text-[44px] text-[#F5F0E5] leading-snug tracking-[-0.3px] mb-5 max-w-md">
              Sometimes Bigger Just Makes More Sense
            </h2>

            {/* Story copy */}
            <div className="space-y-4 text-sm sm:text-base text-[#F5F0E5]/85 leading-relaxed font-light">
              <p>
                When Stackd first launched, we served our loaded cookies in modest 250g tins. But early on, those smaller tins became nearly impossible to source consistently without sacrificing the airtight seal our cookies demand.
              </p>
              <p>
                Bhavya faced a difficult choice: compromise on the packaging, or upgrade to the larger, heavy deep-drawn tin she had originally dreamt of using.
              </p>
              <p className="font-editorial italic text-lg sm:text-xl text-[#F5F0E5] leading-snug">
                “I was terrified customers wouldn’t want to buy a more expensive, larger tin. I kept asking myself if 19 was too young to make a bold bet like this.”
              </p>
              <p>
                Instead, Mumbai responded with pure enthusiasm. The larger tin allowed cookies to remain perfectly intact, layered generously on wax sheets. Customers began ordering them as centrepieces for dinner parties and birthday gifts across the city.
              </p>
            </div>

            {/* Quote and CTA */}
            <div className="mt-8 pt-6 border-t border-[#F5F0E5]/15 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#EADECB]/70 block font-mono">
                  Current Signature
                </span>
                <span className="font-editorial text-xl font-medium text-[#F5F0E5]">
                  Full-Size Keepsake Tin
                </span>
              </div>
              <button
                onClick={onOpenOrder}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5F0E5] hover:bg-[#FFFFFF] text-[#6C1929] text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
              >
                <span>Order A Tin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
