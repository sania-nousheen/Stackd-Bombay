import { getAssetUrl } from "../utils/assets";
import React, { useState, useEffect } from 'react';
import { subscribeSiteMedia } from '../services/firebase';
import { safeLocalStorageSet } from '../utils/mediaStorage';
import ingredientsImage from '../assets/images/ingredients_couverture_butter_1791484056180.jpg';

export const IngredientsFeature: React.FC = () => {
  const [activeIngredient, setActiveIngredient] = useState<number>(0);
  const [ingredientsPhoto, setIngredientsPhoto] = useState<string>(() => {
    try {
      return localStorage.getItem('stackd_ingredients_photo') || ingredientsImage;
    } catch {
      return ingredientsImage;
    }
  });

  useEffect(() => {
    // 1. Real-time subscription to shared Firestore site_media
    const unsubscribe = subscribeSiteMedia((mediaMap) => {
      if (mediaMap.ingredients) {
        setIngredientsPhoto(mediaMap.ingredients);
        safeLocalStorageSet('stackd_ingredients_photo', mediaMap.ingredients);
      }
    });

    // 2. Tab event update
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('stackd_ingredients_photo');
        if (saved) setIngredientsPhoto(saved);
      } catch {}
    };
    window.addEventListener('stackd_data_updated', handleUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('stackd_data_updated', handleUpdate);
    };
  }, []);

  const ingredients = [
    {
      title: 'French Président Butter',
      tag: 'Imported Dairy',
      detail: 'Slow-churned European lactic butter with high butterfat content. It gives our cookies that distinct nutty golden aroma, rich crumb structure, and crisp perimeter without ever tasting greasy.',
      founderQuote: '“Ordinary margarine spreads into a puddle. Real French butter caramelizes into pure gold.”'
    },
    {
      title: 'Belgian Couverture Chocolate',
      tag: '100% Cocoa Butter',
      detail: 'Unlike cheap commercial chocolate chips made from palm-oil compound fats, Belgian couverture is crafted with pure, unadulterated cocoa butter. It melts at body temperature, creating velvety molten rivers in every single bite.',
      founderQuote: '“Compound chocolate leaves a waxy coat on your tongue. Couverture melts instantly on your palate.”'
    },
    {
      title: '100% Eggless Formulation',
      tag: 'Proprietary Crumb',
      detail: 'Developed over 100+ kitchen trials in Worli. We engineered a proprietary hydration and emulsification balance that matches the chewy, chunky New York cookie profile completely egg-free.',
      founderQuote: '“Eggless should never mean compromised chew. We proved it can be twice as decadent.”'
    },
    {
      title: 'Freshly Baked in Worli',
      tag: '24hr Pre-order Model',
      detail: 'We don’t bake for warehouse shelves. Every batch is mixed, chilled, portioned, and baked specifically to order within 24 hours of delivery across Mumbai.',
      founderQuote: '“Fresh out of the oven in South Bombay to your doorstep. That warmth makes all the difference.”'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#2B0810] text-[#F5F0E5] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6C1929]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#140407]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="font-['DM_Sans',sans-serif] font-medium text-[14px] sm:text-[16px] lg:text-[17px] tracking-[1.8px] uppercase text-[#E3D6C2] text-center block mb-3">
            THE PHILOSOPHY OF FLAVOUR
          </span>
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] tracking-[-0.5px] text-[#F5F0E5] text-center mb-3 whitespace-normal lg:whitespace-nowrap">
            Good Ingredients Are Expensive
          </h2>
          <p className="font-editorial italic text-base sm:text-lg text-[#E3D6C2] max-w-xl mx-auto">
            “But compromising on quality would cost the brand more.”
          </p>
        </div>

        {/* Cinematic Grid: Visual Showcase + Technical Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Real Ingredient Editorial Photography */}
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-[16/10] w-full shrink-0 rounded-2xl overflow-hidden border border-[#F5F0E5]/20 shadow-2xl bg-[#170508]">
              <img
                src={getAssetUrl(ingredientsPhoto)}
                alt="Belgian couverture chocolate callets and wrapped French butter in an artisanal bakery setting"
                className="w-full h-full object-cover object-center block"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A060A]/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Photo Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#F5F0E5]/90 bg-[#1A060A]/70 backdrop-blur-md px-4 py-3 rounded-lg border border-[#F5F0E5]/15">
                <span className="font-editorial italic text-sm">
                  Belgian Couverture & French Président Butter
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#F5F0E5]/75">
                  100% Pure Cocoa Butter
                </span>
              </div>
            </div>

            {/* Floating Editorial Quote Tag */}
            <div className="absolute -bottom-6 -left-4 sm:left-6 bg-[#6C1929] text-[#F5F0E5] p-4 sm:p-5 rounded-xl border border-[#F5F0E5]/20 shadow-xl max-w-xs">
              <p className="font-editorial italic text-sm sm:text-base leading-snug">
                “No compound chocolate. No palm oil. Just authentic Belgian callets and European butter.”
              </p>
              <span className="font-signature text-xl text-[#F5F0E5]/80 block mt-1">bhavya</span>
            </div>
          </div>

          {/* RIGHT: Interactive Ingredient Cards */}
          <div className="lg:col-span-5 space-y-4">
            {ingredients.map((item, idx) => {
              const isSelected = activeIngredient === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveIngredient(idx)}
                  className={`p-5 sm:p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#400F1A] border-[#F5F0E5]/30 shadow-lg translate-x-1'
                      : 'bg-[#21060B]/60 border-[#F5F0E5]/10 hover:bg-[#320C15] hover:border-[#F5F0E5]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#E3D6C2]/75">
                      {item.tag}
                    </span>
                    <span className="font-editorial text-xs text-[#F5F0E5]/50">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl sm:text-2xl text-[#F5F0E5] mb-2 font-medium">
                    {item.title}
                  </h3>
                  <p className="font-sans-clean text-xs sm:text-sm text-[#F5F0E5]/80 leading-relaxed font-light mb-3">
                    {item.detail}
                  </p>
                  {isSelected && (
                    <div className="pt-2 border-t border-[#F5F0E5]/10">
                      <p className="font-editorial italic text-xs sm:text-sm text-[#E3D6C2]">
                        {item.founderQuote}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
