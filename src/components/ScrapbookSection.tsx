import React, { useState } from 'react';
import { SCRAPBOOK_CARDS } from '../data/story';

export const ScrapbookSection: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  return (
    <section id="scrapbook" className="py-20 sm:py-28 bg-[#FAF7F0] text-[#6C1929] relative overflow-hidden">
      {/* Background paper texture & grain */}
      <div className="absolute inset-0 paper-grain opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          {/* Small heading in DM Sans Medium (500) */}
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#6C1929]/5 border border-[#6C1929]/15 text-xs tracking-wider text-[#6C1929] font-['DM_Sans',sans-serif] font-medium mb-3">
            Things i learnt
          </div>
          
          {/* Big heading in Cormorant Garamond Medium (500) */}
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-3xl sm:text-4xl lg:text-[44px] text-[#6C1929] leading-snug tracking-[-0.4px] text-center mx-auto text-balance">
            Things I Went While Building A Cookie Brand At 19
          </h2>
        </div>

        {/* 4 Interactive Editorial Scrapbook Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {SCRAPBOOK_CARDS.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
              className={`relative group bg-[#F5F0E5] rounded-xl p-6 sm:p-8 border border-[#6C1929]/15 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
                card.rotation
              } hover:rotate-0 hover:scale-[1.01]`}
            >
              {/* Washi tape accents */}
              {card.tapePosition === 'top' && (
                <div className="tape-top" />
              )}
              {card.tapePosition === 'corner' && (
                <div className="tape-corner" />
              )}
              {card.tapePosition === 'both' && (
                <>
                  <div className="tape-top" />
                  <div className="tape-corner" />
                </>
              )}

              {/* Card Header with Stamp Tag */}
              <div className="flex items-center justify-between border-b border-[#6C1929]/10 pb-4 mb-5">
                <span className="font-sans-clean text-xs font-semibold text-[#6C1929]/80 tracking-wide">
                  {card.tag}
                </span>
                {card.stickerText && (
                  <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded bg-[#6C1929]/10 text-[#6C1929] border border-[#6C1929]/15">
                    {card.stickerText}
                  </span>
                )}
              </div>

              {/* Scrapbook Headings: Small heading DM Sans 500, Big heading Cormorant Garamond 500 */}
              <div className="mb-4">
                <span className="font-['DM_Sans',sans-serif] font-medium text-xs sm:text-sm tracking-wider uppercase text-[#6C1929] block mb-1">
                  {card.headline}
                </span>
                <span className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-2xl sm:text-3xl tracking-tight text-[#420E18] block leading-tight">
                  {card.subhead}
                </span>
              </div>

              {/* Body Narrative */}
              <p className="font-sans-clean text-xs sm:text-sm text-[#44101B]/90 leading-relaxed mb-6 font-normal">
                {card.body}
              </p>

              {/* Handwritten Takeaway Box */}
              <div className="p-4 rounded-lg bg-[#EAE1CF]/70 border-l-2 border-[#6C1929] mt-auto">
                <span className="text-[10px] uppercase tracking-widest text-[#6C1929]/65 block font-semibold mb-1">
                  Founder Standard:
                </span>
                <p className="font-editorial italic text-sm sm:text-base text-[#6C1929] leading-snug">
                  “{card.takeaway}”
                </p>
              </div>

              {/* Scrapbook Pin / Number indicator */}
              <div className="mt-5 pt-3 border-t border-[#6C1929]/10 flex items-center justify-between text-xs text-[#6C1929]/60 font-sans-clean">
                <span>Stackd Archive · Entry 0{idx + 1}</span>
                <span className="font-signature text-xl text-[#6C1929]/80">bhavya</span>
              </div>
            </div>
          ))}
        </div>

        {/* 5th Image: The Unbreakable Rule Callout Box */}
        <div className="mt-14 sm:mt-18 p-8 sm:p-10 rounded-2xl bg-[#6C1929] text-[#F5F0E5] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FAF7F0]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="max-w-4xl relative z-10">
            {/* Heading in Cormorant Garamond Medium (500) */}
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-3xl sm:text-4xl lg:text-[42px] text-[#F5F0E5] block mb-3 leading-tight tracking-[-0.3px]">
              The Unbreakable Rule
            </h2>
            
            {/* Matter text 2nd para: increased width till end of card */}
            <h3 className="font-editorial text-lg sm:text-xl lg:text-2xl font-normal leading-snug mb-3 max-w-full">
              “Stackd will never compete by making the cheapest cookie. We compete on making the one you can’t stop thinking about.”
            </h3>
            
            {/* Matter text 3rd para: increased width till end of card */}
            <p className="font-sans-clean text-xs sm:text-sm text-[#F5F0E5]/80 leading-relaxed font-light max-w-full">
              Imported French Président butter. Pure Belgian couverture chocolate rich in natural cocoa butter. Freshly baked in small, obsessive batches right here in Worli, Mumbai.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
